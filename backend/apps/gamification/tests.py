"""Faza 8 — geymifikatsiya + ota-ona paneli testlari."""

import uuid
from datetime import timedelta

import pytest
from django.core.management import call_command
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from apps.accounts.models import ChildProfile
from apps.content.models import Word
from apps.gamification.models import ChildAchievement, ChildForestElement
from apps.gamification.services import evaluate_rewards, minutes_today
from apps.learning.models import ItemState, LearningEvent


def _child_ctx(api, parent, child):
    access = RefreshToken.for_user(parent).access_token
    access["parent_id"] = str(parent.id)
    access["active_child_id"] = str(child.id)
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {access}")
    return api


def _master_words(child, n, strength=0.7):
    for w in Word.objects.all()[:n]:
        ItemState.objects.get_or_create(
            child=child,
            item_type="word",
            item_id=w.id,
            defaults={"receptive_strength": strength},
        )


@pytest.mark.django_db
def test_evaluate_rewards_unlocks_and_idempotent(parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    _master_words(child, 3)  # "first_words" (count 3) ochiladi; "ten_words" (10) YO'Q
    evaluate_rewards(child)
    assert ChildAchievement.objects.filter(
        child=child, achievement__key="first_words"
    ).exists()
    assert not ChildAchievement.objects.filter(
        child=child, achievement__key="ten_words"
    ).exists()
    assert ChildForestElement.objects.filter(
        child=child, element__key="flowers"
    ).exists()
    # IDEMPOTENT — qayta ochmaydi
    n = ChildAchievement.objects.filter(child=child).count()
    evaluate_rewards(child)
    assert ChildAchievement.objects.filter(child=child).count() == n


@pytest.mark.django_db
def test_evaluate_boundary(parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    _master_words(child, 2)  # 2 < 3 → "first_words" ochilmaydi
    evaluate_rewards(child)
    assert not ChildAchievement.objects.filter(
        child=child, achievement__key="first_words"
    ).exists()


@pytest.mark.django_db
def test_forest_recent_then_seen(api, parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    _master_words(child, 3)
    c = _child_ctx(api, parent, child)
    r1 = c.get("/api/v1/gamification/forest/")
    assert r1.status_code == 200
    assert len(r1.data["recent"]) > 0  # yangi ochilgan ("yangi do'st!")
    assert any(e["key"] == "flowers" for e in r1.data["elements"])
    # GET endi belgilamaydi (idempotent) — recent hali ko'rinadi
    r2 = c.get("/api/v1/gamification/forest/")
    assert len(r2.data["recent"]) > 0
    # POST seen ack (ResultView chaqiradi) → recent bo'shaydi
    assert c.post("/api/v1/gamification/forest/seen/").status_code == 200
    r3 = c.get("/api/v1/gamification/forest/")
    assert len(r3.data["recent"]) == 0


@pytest.mark.django_db
def test_child_token_cannot_change_parent_settings(api, parent):
    """XAVFSIZLIK: bola-kontekst token ota-ona sozlamalarini (daily_limit, progress) o'zgartira/ko'ra olmaydi."""
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    c = _child_ctx(api, parent, child)  # active_child_id claim'li token
    # daily_limit PATCH → 403 (IsParentToken)
    r = c.patch(
        f"/api/v1/profiles/{child.id}/", {"daily_limit_minutes": 9999}, format="json"
    )
    assert r.status_code == 403
    # ota-ona paneli (progress) → 403
    assert c.get(f"/api/v1/profiles/{child.id}/progress/").status_code == 403
    child.refresh_from_db()
    assert child.daily_limit_minutes is None  # bola limitni uzaytira olmadi


@pytest.mark.django_db
def test_minutes_today_gap_based(parent):
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    base = timezone.now()
    for off in [0, 60, 120]:  # gaplar 60,60 < 180 → 120s faol
        LearningEvent.objects.create(
            event_id=uuid.uuid4(),
            child=child,
            item_type="word",
            item_id=uuid.uuid4(),
            ts=base + timedelta(seconds=off),
        )
    # tanaffus (gap 600 ≥ 180) — qo'shilmaydi
    LearningEvent.objects.create(
        event_id=uuid.uuid4(),
        child=child,
        item_type="word",
        item_id=uuid.uuid4(),
        ts=base + timedelta(seconds=720),
    )
    assert minutes_today(child) == 2  # faqat 120s; tanaffus o'tkazib yuboriladi


@pytest.mark.django_db
def test_timecheck_soft_limit(api, parent):
    child = ChildProfile.objects.create(
        parent=parent, display_name="A", age_band="6-7", daily_limit_minutes=1
    )
    base = timezone.now()
    for off in [0, 60, 120, 180]:  # ~3 daq faol (gaplar 60 < 180)
        LearningEvent.objects.create(
            event_id=uuid.uuid4(),
            child=child,
            item_type="word",
            item_id=uuid.uuid4(),
            ts=base + timedelta(seconds=off),
        )
    r = _child_ctx(api, parent, child).get("/api/v1/gamification/timecheck/")
    assert r.status_code == 200
    assert r.data["limit"] == 1
    assert r.data["exceeded"] is True  # 3 daq >= 1 daq limit


@pytest.mark.django_db
def test_parent_progress_real(auth_api, parent):
    call_command("seed_content")
    child = ChildProfile.objects.create(parent=parent, display_name="A", age_band="6-7")
    _master_words(child, 4)
    r = auth_api.get(f"/api/v1/profiles/{child.id}/progress/")
    assert r.status_code == 200
    assert r.data["words"]["receptive_mastered"] >= 4
    assert "themes" in r.data and "streak" in r.data and "activity" in r.data


@pytest.mark.django_db
def test_parent_progress_foreign_child_forbidden(auth_api, parent_b):
    # auth_api = parent (A) JWT; parent_b ning bolasi — egalik yo'q → 404
    other = ChildProfile.objects.create(
        parent=parent_b, display_name="O", age_band="6-7"
    )
    r = auth_api.get(f"/api/v1/profiles/{other.id}/progress/")
    assert r.status_code == 404
