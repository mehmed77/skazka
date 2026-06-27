"""Faza 6 — SRS dvigateli testlari (schedule, idempotentlik, due, lineer progress, authz)."""

import uuid
from datetime import timedelta

import pytest
from django.core.management import call_command
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import ChildProfile
from apps.content.models import Theme, Word
from apps.learning.models import ItemState, LearningEvent
from apps.learning.scheduler import schedule
from apps.learning.services import compute_theme_statuses, get_due, record_event


def _child_ctx(api, parent, child):
    """Bola-kontekst token (enter chiqargandek)."""
    access = RefreshToken.for_user(parent).access_token
    access["parent_id"] = str(parent.id)
    access["active_child_id"] = str(child.id)
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return api


def _ev(child, word, correct=True, game="eshit_va_bos", eid=None):
    return {
        "event_id": eid or uuid.uuid4(),
        "item_type": "word",
        "item_id": word.id,
        "game_type": game,
        "is_correct": correct,
        "latency_ms": 1200,
        "hint_used": False,
    }


# ── schedule() — izolyatsiyalangan unit testlar ──────────────────────────
def test_schedule_correct_grows_interval():
    st = ItemState(item_type="word", item_id=uuid.uuid4())
    schedule(st, is_correct=True)
    first_due = st.due_at
    assert st.reps == 1
    assert st.stability >= 1.0
    assert first_due > timezone.now() + timedelta(hours=12)
    # ketma-ket to'g'ri → interval uzoqlashadi
    schedule(st, is_correct=True)
    schedule(st, is_correct=True)
    schedule(st, is_correct=True)
    assert st.reps == 4
    assert st.due_at > first_due  # stability oshdi


@pytest.mark.django_db
def test_schedule_wrong_shrinks_interval():
    st = ItemState(item_type="word", item_id=uuid.uuid4(), reps=3, stability=7.0)
    schedule(st, is_correct=False)
    assert st.reps == 0
    assert st.lapses == 1
    assert st.due_at <= timezone.now() + timezone.timedelta(minutes=11)  # tez qaytadi


# ── record_event — ItemState yaratish + idempotentlik ────────────────────
@pytest.mark.django_db
def test_record_event_creates_state_and_schedules(parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    word = Word.objects.get(lemma="кошка")
    ev, created = record_event(child, _ev(child, word, correct=True))
    assert created
    st = ItemState.objects.get(child=child, item_id=word.id)
    assert st.reps == 1
    assert st.exposures == 1
    assert st.receptive_strength > 0
    assert st.due_at > timezone.now()


@pytest.mark.django_db
def test_event_idempotent(parent):
    """KRITIK: bir xil event_id ikki marta → state BIR marta o'zgaradi (outbox sync xavfsizligi)."""
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    word = Word.objects.get(lemma="кошка")
    eid = uuid.uuid4()
    record_event(child, _ev(child, word, correct=True, eid=eid))
    ev2, created2 = record_event(child, _ev(child, word, correct=True, eid=eid))
    assert created2 is False  # idempotent
    assert LearningEvent.objects.filter(event_id=eid).count() == 1
    st = ItemState.objects.get(child=child, item_id=word.id)
    assert st.reps == 1  # IKKI marta emas
    assert st.exposures == 1


@pytest.mark.django_db
def test_exposure_creates_state_without_schedule(parent):
    """intro exposure → ItemState (due +~1kun), schedule HAYDALMAYDI (reps=0)."""
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    word = Word.objects.get(lemma="собака")
    record_event(child, _ev(child, word, correct=True, game="intro"))
    st = ItemState.objects.get(child=child, item_id=word.id)
    assert st.reps == 0  # retrieval bo'lmadi
    assert st.exposures == 1
    assert st.due_at > timezone.now() + timezone.timedelta(hours=12)


# ── get_due ──────────────────────────────────────────────────────────────
@pytest.mark.django_db
def test_get_due_returns_due_only(parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    due_word = Word.objects.get(lemma="кошка")
    future_word = Word.objects.get(lemma="собака")
    ItemState.objects.create(
        child=child, item_type="word", item_id=due_word.id,
        due_at=timezone.now() - timezone.timedelta(days=1),
    )
    ItemState.objects.create(
        child=child, item_type="word", item_id=future_word.id,
        due_at=timezone.now() + timezone.timedelta(days=5),
    )
    due = get_due(child)
    ids = {str(s.item_id) for s in due}
    assert str(due_word.id) in ids
    assert str(future_word.id) not in ids


# ── Endpointlar (bola-kontekst) ──────────────────────────────────────────
@pytest.mark.django_db
def test_event_endpoint_idempotent(api, parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    word = Word.objects.get(lemma="кошка")
    c = _child_ctx(api, parent, child)
    payload = {"event_id": str(uuid.uuid4()), "item_type": "word", "item_id": str(word.id),
               "game_type": "eshit_va_bos", "is_correct": True, "latency_ms": 900}
    r1 = c.post("/api/v1/learning/event/", payload, format="json")
    r2 = c.post("/api/v1/learning/event/", payload, format="json")
    assert r1.status_code == 200 and r2.status_code == 200
    assert r2.data["idempotent"] is True
    assert ItemState.objects.get(child=child, item_id=word.id).reps == 1


@pytest.mark.django_db
def test_session_endpoint_returns_due(api, parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    word = Word.objects.get(lemma="кошка")
    ItemState.objects.create(
        child=child, item_type="word", item_id=word.id,
        due_at=timezone.now() - timezone.timedelta(hours=1),
    )
    r = _child_ctx(api, parent, child).get("/api/v1/learning/session/")
    assert r.status_code == 200
    assert r.data["count"] >= 1
    assert any(d["lemma"] == "кошка" for d in r.data["due"])


@pytest.mark.django_db
def test_learning_requires_child_context(api, parent):
    access = RefreshToken.for_user(parent).access_token  # active_child_id YO'Q
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    assert api.get("/api/v1/learning/session/").status_code == 403


@pytest.mark.django_db
def test_learning_foreign_child_forbidden(api, parent, parent_b):
    other = ChildProfile.objects.create(parent=parent_b, display_name="O", age_band="6-7")
    # parent o'z tokeni bilan parent_b ning bolasini da'vo qiladi → 403
    access = RefreshToken.for_user(parent).access_token
    access["parent_id"] = str(parent.id)
    access["active_child_id"] = str(other.id)
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    assert api.get("/api/v1/learning/session/").status_code == 403


# ── Progress (REAL + LINEER) ─────────────────────────────────────────────
@pytest.mark.django_db
def test_progress_linear_unlock(parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    themes = list(Theme.objects.order_by("level__order", "order"))
    t1, t2 = themes[0], themes[1]

    # Boshида: 1-mavzu ochiq, 2-mavzu qulf (lineer)
    s0 = compute_theme_statuses(child)
    assert s0[str(t1.id)] == "available"
    assert s0[str(t2.id)] == "locked"

    # 1-mavzu so'zlarining ko'pchiligini o'zlashtirish (2 to'g'ri → strength 0.68)
    t1_words = list(t1.words.all())
    for w in t1_words:
        for _ in range(2):
            record_event(child, _ev(child, w, correct=True))

    s1 = compute_theme_statuses(child)
    assert s1[str(t1.id)] == "done"
    assert s1[str(t2.id)] == "available"  # keyingisi ochildi


@pytest.mark.django_db
def test_empty_theme_does_not_block_chain(parent):
    """Bo'sh mavzu (so'z yo'q) lineer zanjirni TO'SMASLIGI kerak (bola qamalib qolmasin)."""
    from apps.content.models import Language, Level
    from apps.content.models import Theme as ThemeModel

    lang = Language.objects.create(code="xx", name="Test")
    level = Level.objects.create(language=lang, order=1, title_uz="L")
    empty = ThemeModel.objects.create(level=level, order=1, key="empty", title_uz="Bo'sh")
    populated = ThemeModel.objects.create(level=level, order=2, key="pop", title_uz="To'la")
    Word.objects.create(language=lang, lemma="мама", theme=populated)

    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    statuses = compute_theme_statuses(child)
    assert statuses[str(empty.id)] == "available"
    assert statuses[str(populated.id)] != "locked"  # bo'sh mavzu keyingisini qulflamadi


@pytest.mark.django_db
def test_curriculum_reflects_progress(api, parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    r = _child_ctx(api, parent, child).get("/api/v1/curriculum/")
    assert r.status_code == 200
    # birinchi mavzu darslari "available", progress REAL keladi
    first_theme = r.data["levels"][0]["themes"][0]
    assert first_theme["lessons"][0]["progress"]["status"] in {"available", "started", "done"}
