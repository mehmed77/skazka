"""Skeleton smoke testlari."""


def test_health_ok(api):
    resp = api.get("/api/health/")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}


def test_config_has_brand(api):
    resp = api.get("/api/config/")
    assert resp.status_code == 200
    assert resp.json()["brand"]["name"] == "SKAZKA"
