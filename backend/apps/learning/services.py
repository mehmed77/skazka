"""SRS xizmatlari — record_event (idempotent), get_due, progress (lineer)."""

from datetime import timedelta

from django.db import IntegrityError, transaction
from django.db.models import Max
from django.utils import timezone

from .models import ItemState, ItemType, LearningEvent
from .scheduler import RECEPTIVE, schedule

NEW_DUE_DAYS = 1  # yangi item (intro exposure) → +1 kun


def _dimension_for(game_type: str) -> str:
    """game_type → SRS o'lchovi (reseptiv/ekspressiv). GameType.dimension'dan (fallback reseptiv)."""
    from apps.content.models import GameType

    gt = GameType.objects.filter(key=game_type).only("dimension").first()
    return gt.dimension if gt else RECEPTIVE


# Progress (lineer ochilish) ostonalari — YUMSHOQ (bola qamalib qolmasin, §6.3)
STRENGTH_THRESHOLD = 0.5  # so'z "o'zlashtirilgan" deb hisoblanadi
DONE_RATIO = 0.6  # mavzu so'zlarining ko'pchiligi (mukammal EMAS)


@transaction.atomic
def record_event(child, data: dict):
    """Eventni IDEMPOTENT yozadi va ItemState'ni yangilaydi.

    Bir xil event_id ikkinchi marta kelsa → mavjud event qaytadi, state QAYTA o'zgarmaydi.
    Qaytaradi: (event, created: bool).
    """
    event_id = data["event_id"]
    existing = LearningEvent.objects.filter(event_id=event_id).first()
    if existing:
        return (
            existing,
            False,
        )  # IDEMPOTENT (ketma-ket dublikat) — state qayta hisoblanmaydi

    try:
        # Savepoint: KONKURENT dublikat (tekshir-keyin-yoz race) → IntegrityError, 500 emas.
        with transaction.atomic():
            ev = LearningEvent.objects.create(
                event_id=event_id,
                child=child,
                item_type=data["item_type"],
                item_id=data["item_id"],
                game_type=data.get("game_type", "") or "",
                is_correct=bool(data.get("is_correct")),
                latency_ms=data.get("latency_ms"),
                hint_used=bool(data.get("hint_used")),
                session_id=data.get("session_id") or "",
                ts=data.get("ts") or timezone.now(),
            )
    except IntegrityError:
        # Boshqa so'rov ayni event_id'ni yozib ulgurdi → idempotent (state qayta o'zgarmaydi)
        return LearningEvent.objects.get(event_id=event_id), False

    state, _ = ItemState.objects.get_or_create(
        child=child,
        item_type=ev.item_type,
        item_id=ev.item_id,
        defaults={"due_at": timezone.now() + timedelta(days=NEW_DUE_DAYS)},
    )
    state.exposures += 1

    if ev.game_type == "intro":
        # Exposure — retrieval EMAS. ItemState yaratildi (due +1d); last_result/strength/schedule
        # TEGINILMAYDI (xato mashqdan keyingi intro last_result'ni noto'g'ri "tuzatmasin").
        pass
    else:
        # Retrieval mashqi: natija + interval + mastery. dimension (reseptiv/ekspressiv) GameType'dan.
        state.last_result = ev.is_correct
        schedule(state, ev.is_correct, ev.latency_ms, _dimension_for(ev.game_type))

    state.save()
    return ev, True


def get_due(child, limit: int = 8, now=None):
    """due_at <= now bo'lgan itemlar (eng kechikkani birinchi). Hozir faqat 'word'.

    §4.4 (confusable yonma-yon emas) — sessiya navbati qatlamida (frontend buildSessionQueue,
    avoidConfusableAdjacency) hal qilinadi: bu yer faqat due ro'yxatini beradi.
    """
    now = now or timezone.now()
    # word + letter (Faza 7): harflar ham due bo'lib qaytadi (takrorlashda)
    qs = ItemState.objects.filter(child=child, due_at__lte=now).order_by("due_at")[
        :limit
    ]
    return list(qs)


def progress_stamp(child) -> str:
    """Bola progress 'versiyasi' (ETag uchun) — eng so'nggi ItemState yangilanishi.

    Progress o'zgarsa ETag o'zgaradi → 304 eskirgan progress qaytarmaydi.
    """
    agg = ItemState.objects.filter(child=child).aggregate(m=Max("updated_at"))
    m = agg["m"]
    return str(int(m.timestamp())) if m else "0"


def compute_theme_statuses(child) -> dict:
    """{theme_id(str): 'locked'|'available'|'started'|'done'} — REAL + LINEER ochilish.

    Lineer: 1-mavzu DOIM ochiq; mavzu 'done' bo'lsa keyingisi ochiladi, aks holda keyingilar qulf.
    'done' YUMSHOQ: mavzu so'zlarining >= DONE_RATIO qismi receptive_strength >= STRENGTH_THRESHOLD
    (mukammal emas — bola qamalib qolmasin).
    """
    from apps.content.models import Theme

    states = {
        str(s.item_id): s
        for s in ItemState.objects.filter(child=child, item_type=ItemType.WORD)
    }
    statuses: dict = {}
    themes = (
        Theme.objects.select_related("level")
        .order_by("level__order", "order")
        .prefetch_related("words")
    )

    chain_open = True  # 1-mavzu ochiq
    for theme in themes:
        if not chain_open:
            statuses[str(theme.id)] = "locked"
            continue
        word_ids = [str(w.id) for w in theme.words.all()]
        if not word_ids:
            # Bo'sh mavzu (so'z yo'q — kontent to'liq emas / Word.theme uzilgan) zanjirni
            # TO'SMAYDI (bola qamalib qolmasin). chain_open o'zgarmaydi.
            statuses[str(theme.id)] = "available"
            continue
        seen = [wid for wid in word_ids if wid in states]
        strong = [
            wid
            for wid in seen
            if max(states[wid].receptive_strength, states[wid].expressive_strength)
            >= STRENGTH_THRESHOLD
        ]
        done = bool(word_ids) and (len(strong) / len(word_ids) >= DONE_RATIO)
        statuses[str(theme.id)] = (
            "done" if done else ("started" if seen else "available")
        )
        chain_open = done  # lineer: done bo'lmasa keyingilar qulf

    return statuses
