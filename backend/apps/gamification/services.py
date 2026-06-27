"""gamification xizmatlari — MAVJUD SRS ma'lumotidan mukofot/rivoj hisoblash.

evaluate_rewards IDEMPOTENT (qayta ochmaydi). Hech qaysi SRS/learning kodini O'ZGARTIRMAYDI —
faqat o'qiydi. Vaqt GAP-ASOSLI hisoblanadi (ostona konstanta — qurilmada sozlash uchun).
"""

from datetime import timedelta

from django.db import transaction
from django.utils import timezone

from apps.learning.models import ItemState, ItemType, LearningEvent

from .models import (
    Achievement,
    ChildAchievement,
    ChildForestElement,
    ChildMishkaItem,
    ForestElement,
    MishkaItem,
    StreakRecord,
)

MASTERY_THRESHOLD = 0.5  # so'z/harf "o'zlashtirilgan" (learning.services bilan bir xil)
# ⚠️ Gap ostonasi — ketma-ket event'lar orasi shundan kichik bo'lsa faol vaqtga qo'shiladi.
# Bitta konstanta (qurilmada/amalda sozlash uchun — harf_chiz ostonasi kabi).
ACTIVE_GAP_SECONDS = 180


# ── Vaqt (gap-asosli — bir necha sessiyani to'g'ri ajratadi) ──
def minutes_today(child) -> int:
    today = timezone.localdate()
    ts_list = list(
        LearningEvent.objects.filter(child=child, ts__date=today)
        .order_by("ts")
        .values_list("ts", flat=True)
    )
    active = 0.0
    for i in range(1, len(ts_list)):
        gap = (ts_list[i] - ts_list[i - 1]).total_seconds()
        if 0 < gap < ACTIVE_GAP_SECONDS:  # tanaffus (gap ≥ ostona) qo'shilmaydi
            active += gap
    return round(active / 60)


def active_days(child, days=30) -> int:
    since = timezone.localdate() - timedelta(days=days)
    return (
        LearningEvent.objects.filter(child=child, ts__date__gte=since)
        .dates("ts", "day")
        .count()
    )


def compute_streak(child):
    """Ketma-ket faol kunlar. StreakRecord'ni yangilaydi (ota-ona paneli uchun; §6.3 — ayblov emas)."""
    dates = sorted(
        {d for d in LearningEvent.objects.filter(child=child).dates("ts", "day")},
        reverse=True,
    )
    today = timezone.localdate()
    current = 0
    if dates and dates[0] in (today, today - timedelta(days=1)):
        cursor = dates[0]
        for d in dates:
            if d == cursor:
                current += 1
                cursor = cursor - timedelta(days=1)
            elif d < cursor:
                break
    # eng uzun
    longest = 0
    run = 0
    prev = None
    for d in sorted(dates):
        if prev is not None and d == prev + timedelta(days=1):
            run += 1
        else:
            run = 1
        longest = max(longest, run)
        prev = d
    rec, _ = StreakRecord.objects.get_or_create(child=child)
    rec.current = current
    rec.longest = max(longest, rec.longest)
    rec.last_active_date = dates[0] if dates else None
    rec.save()
    return rec


# ── Rule handler-map (mukofot shartlari — registry shart emas, oddiy map) ──
def _words_receptive(child, p):
    return ItemState.objects.filter(
        child=child, item_type=ItemType.WORD, receptive_strength__gte=MASTERY_THRESHOLD
    ).count() >= int(p.get("count", 1))


def _letters_receptive(child, p):
    return ItemState.objects.filter(
        child=child,
        item_type=ItemType.LETTER,
        receptive_strength__gte=MASTERY_THRESHOLD,
    ).count() >= int(p.get("count", 1))


def _expressive_any(child, p):
    return ItemState.objects.filter(
        child=child, expressive_strength__gte=MASTERY_THRESHOLD
    ).count() >= int(p.get("count", 1))


def _theme_done(child, p):
    from apps.content.models import Theme
    from apps.learning.services import compute_theme_statuses

    theme = Theme.objects.filter(key=p.get("theme_key")).first()
    if not theme:
        return False
    return compute_theme_statuses(child).get(str(theme.id)) == "done"


def _streak(child, p):
    return compute_streak(child).current >= int(p.get("days", 1))


RULE_HANDLERS = {
    "words_receptive": _words_receptive,
    "letters_receptive": _letters_receptive,
    "expressive_any": _expressive_any,
    "theme_done": _theme_done,
    "streak": _streak,
}


def _rule_met(child, rule_json) -> bool:
    handler = RULE_HANDLERS.get((rule_json or {}).get("type"))
    return bool(handler and handler(child, rule_json))


@transaction.atomic
def evaluate_rewards(child):
    """Katalogni MAVJUD SRS'ga solishtirib ochilishlarni yaratadi. IDEMPOTENT (qayta ochmaydi).

    Yangi yaratilganlar seen=False (natija ekranida "yangi"). Hech narsa qaytarmaydi — view
    ChildX'larni o'qib seen/recent'ni boshqaradi.
    """
    unlocked_ach = set(
        ChildAchievement.objects.filter(child=child).values_list(
            "achievement_id", flat=True
        )
    )
    for ach in Achievement.objects.all():
        if ach.id not in unlocked_ach and _rule_met(child, ach.rule_json):
            ChildAchievement.objects.get_or_create(child=child, achievement=ach)

    unlocked_el = set(
        ChildForestElement.objects.filter(child=child).values_list(
            "element_id", flat=True
        )
    )
    for el in ForestElement.objects.all():
        if el.id not in unlocked_el and _rule_met(child, el.rule_json):
            ChildForestElement.objects.get_or_create(child=child, element=el)

    unlocked_mi = set(
        ChildMishkaItem.objects.filter(child=child).values_list("item_id", flat=True)
    )
    for it in MishkaItem.objects.all():
        if it.id not in unlocked_mi and _rule_met(child, it.rule_json):
            ChildMishkaItem.objects.get_or_create(child=child, item=it)


@transaction.atomic
def mark_rewards_seen(child):
    """ "Yangi" mukofotlarni ko'rilgan deb belgilaydi (ResultView ack'i). GET endi belgilamaydi."""
    ChildForestElement.objects.filter(child=child, seen=False).update(seen=True)
    ChildMishkaItem.objects.filter(child=child, seen=False).update(seen=True)
    ChildAchievement.objects.filter(child=child, seen=False).update(seen=True)


# ── Ota-ona paneli agregati (REAL SRS'dan) ──
def child_progress(child):
    def summarize(item_type):
        qs = ItemState.objects.filter(child=child, item_type=item_type)
        return {
            "seen": qs.count(),
            "receptive_mastered": qs.filter(
                receptive_strength__gte=MASTERY_THRESHOLD
            ).count(),
            "expressive_mastered": qs.filter(
                expressive_strength__gte=MASTERY_THRESHOLD
            ).count(),
        }

    from apps.content.models import Theme
    from apps.learning.services import compute_theme_statuses

    statuses = compute_theme_statuses(child)
    themes = [
        {
            "key": t.key,
            "title_uz": t.title_uz,
            "title_ru": t.title_ru,
            "status": statuses.get(str(t.id), "available"),
        }
        for t in Theme.objects.select_related("level").order_by("level__order", "order")
    ]

    # Qiyin itemlar (ko'p unutilgan / past kuch) — ota-onaga ko'rsatish uchun
    difficult = []
    for st in ItemState.objects.filter(child=child, lapses__gte=2).order_by("-lapses")[
        :10
    ]:
        label = _item_label(st)
        if label:
            difficult.append(
                {"label": label, "type": st.item_type, "lapses": st.lapses}
            )

    streak = compute_streak(child)
    return {
        "words": summarize(ItemType.WORD),
        "letters": summarize(ItemType.LETTER),
        "themes": themes,
        "activity": {
            "minutes_today": minutes_today(child),
            "active_days_30": active_days(child, 30),
        },
        "streak": {"current": streak.current, "longest": streak.longest},
        "difficult": difficult,
    }


def _item_label(state):
    from apps.content.models import Letter, Word

    if state.item_type == ItemType.WORD:
        w = Word.objects.filter(id=state.item_id).first()
        return w.lemma if w else None
    ltr = Letter.objects.filter(id=state.item_id).first()
    return ltr.char if ltr else None
