"""accounts — auth va bola profillari testlari (pytest --reuse-db)."""

import pytest

from apps.accounts.models import ChildProfile, ParentAccount

# ── Skeleton smoke ──────────────────────────────────────────


def test_health_ok(api):
    resp = api.get("/api/health/")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_config_has_brand(api):
    resp = api.get("/api/config/")
    assert resp.status_code == 200
    assert resp.json()["brand"]["name"] == "SKAZKA"


# ── Ota-ona auth ────────────────────────────────────────────


@pytest.mark.django_db
def test_register_phone(api):
    resp = api.post(
        "/api/v1/auth/register/",
        {"phone": "+998901234567", "password": "Str0ngPass9", "full_name": "Ali"},
        format="json",
    )
    assert resp.status_code == 201, resp.data
    assert "access" in resp.data and "refresh" in resp.data
    assert resp.data["parent"]["phone"] == "+998901234567"
    assert ParentAccount.objects.filter(phone="+998901234567").count() == 1


@pytest.mark.django_db
def test_register_requires_phone_or_email(api):
    resp = api.post("/api/v1/auth/register/", {"password": "secret12"}, format="json")
    assert resp.status_code == 400


@pytest.mark.django_db
def test_login_with_email(api):
    ParentAccount.objects.create_user(email="mom@example.uz", password="secret12")
    resp = api.post(
        "/api/v1/auth/login/",
        {"login": "mom@example.uz", "password": "secret12"},
        format="json",
    )
    assert resp.status_code == 200
    assert "access" in resp.data


@pytest.mark.django_db
def test_login_wrong_password(api, parent):
    resp = api.post(
        "/api/v1/auth/login/",
        {"login": "+998901112233", "password": "WRONG"},
        format="json",
    )
    assert resp.status_code == 400


@pytest.mark.django_db
def test_me_requires_auth(api):
    assert api.get("/api/v1/auth/me/").status_code == 401


@pytest.mark.django_db
def test_me(auth_api):
    resp = auth_api.get("/api/v1/auth/me/")
    assert resp.status_code == 200
    assert resp.data["full_name"] == "Ota-ona A"


# ── Bola profillari ─────────────────────────────────────────


@pytest.mark.django_db
def test_create_and_list_profiles(auth_api, parent):
    for name in ("Olim", "Laylo"):
        r = auth_api.post(
            "/api/v1/profiles/",
            {"display_name": name, "avatar_id": "mishka", "age_band": "3-4"},
            format="json",
        )
        assert r.status_code == 201, r.data
    lst = auth_api.get("/api/v1/profiles/")
    assert lst.status_code == 200
    results = lst.data["results"] if "results" in lst.data else lst.data
    assert len(results) == 2


@pytest.mark.django_db
def test_pin_never_returned(auth_api):
    r = auth_api.post(
        "/api/v1/profiles/",
        {"display_name": "Olim", "age_band": "5-6", "pin": "1234"},
        format="json",
    )
    assert r.status_code == 201
    assert "pin" not in r.data
    assert r.data["has_pin"] is True


@pytest.mark.django_db
def test_enter_without_pin_returns_child_token(auth_api, parent):
    child = ChildProfile.objects.create(
        parent=parent, display_name="Olim", age_band="3-4"
    )
    r = auth_api.post(f"/api/v1/profiles/{child.id}/enter/", {}, format="json")
    assert r.status_code == 200
    assert "access" in r.data
    assert r.data["child"]["display_name"] == "Olim"


@pytest.mark.django_db
def test_enter_with_pin(auth_api, parent):
    child = ChildProfile(parent=parent, display_name="Laylo", age_band="6-7")
    child.set_pin("4321")
    child.save()
    assert (
        auth_api.post(
            f"/api/v1/profiles/{child.id}/enter/", {"pin": "0000"}, format="json"
        ).status_code
        == 400
    )
    ok = auth_api.post(
        f"/api/v1/profiles/{child.id}/enter/", {"pin": "4321"}, format="json"
    )
    assert ok.status_code == 200 and "access" in ok.data


# ── Security hardening (review topilmalari) ─────────────────


@pytest.mark.django_db
def test_phone_normalized_register_then_login(api):
    """Bo'sh joyli telefon bilan ro'yxat → bo'sh joysiz login ishlaydi (normalizatsiya)."""
    reg = api.post(
        "/api/v1/auth/register/",
        {"phone": "+998 99 100 20 30", "password": "Str0ngPass9"},
        format="json",
    )
    assert reg.status_code == 201, reg.data
    ok = api.post(
        "/api/v1/auth/login/",
        {"login": "+998991002030", "password": "Str0ngPass9"},
        format="json",
    )
    assert ok.status_code == 200


@pytest.mark.django_db
def test_weak_password_rejected(api):
    """Django parol validatorlari ishga tushadi (qisqa/raqamli parol rad)."""
    r = api.post(
        "/api/v1/auth/register/",
        {"phone": "+998900000001", "password": "1234567"},
        format="json",
    )
    assert r.status_code == 400


@pytest.mark.django_db
def test_pin_must_be_4_digits(auth_api):
    bad = auth_api.post(
        "/api/v1/profiles/",
        {"display_name": "X", "age_band": "3-4", "pin": "12"},
        format="json",
    )
    assert bad.status_code == 400
    ok = auth_api.post(
        "/api/v1/profiles/",
        {"display_name": "X", "age_band": "3-4", "pin": "1234"},
        format="json",
    )
    assert ok.status_code == 201


# ── Object-level izolyatsiya ────────────────────────────────


@pytest.mark.django_db
def test_other_parent_cannot_see_or_enter(auth_api, parent_b):
    """parent_b ning bolasini parent (auth_api) ko'ra/kira OLMAYDI → 404."""
    other_child = ChildProfile.objects.create(
        parent=parent_b, display_name="Begona", age_band="3-4"
    )
    assert auth_api.get(f"/api/v1/profiles/{other_child.id}/").status_code == 404
    assert (
        auth_api.post(
            f"/api/v1/profiles/{other_child.id}/enter/", {}, format="json"
        ).status_code
        == 404
    )
    # ro'yxatda ham ko'rinmaydi
    lst = auth_api.get("/api/v1/profiles/")
    results = lst.data["results"] if "results" in lst.data else lst.data
    assert all(c["display_name"] != "Begona" for c in results)
