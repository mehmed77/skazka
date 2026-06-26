"""Pytest umumiy fixture'lar."""

import pytest
from rest_framework.test import APIClient

from apps.accounts.models import ParentAccount


@pytest.fixture(autouse=True)
def _clear_throttle_cache():
    """Har test oldidan throttle hisoblagichlarini tozalaydi (deterministik)."""
    from django.core.cache import cache

    cache.clear()
    yield


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def parent(db):
    return ParentAccount.objects.create_user(
        phone="+998901112233", password="pass12345", full_name="Ota-ona A"
    )


@pytest.fixture
def parent_b(db):
    return ParentAccount.objects.create_user(
        phone="+998905556677", password="pass12345", full_name="Ota-ona B"
    )


@pytest.fixture
def auth_api(api, parent):
    """parent sifatida autentifikatsiyalangan klient."""
    resp = api.post(
        "/api/v1/auth/login/",
        {"login": "+998901112233", "password": "pass12345"},
        format="json",
    )
    api.credentials(HTTP_AUTHORIZATION=f"Bearer {resp.data['access']}")
    return api
