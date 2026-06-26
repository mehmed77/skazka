"""SKAZKA — asosiy URL marshrutlari (skeleton)."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView


def health(_request):
    """Liveness probe — Docker/monitoring uchun."""
    return JsonResponse({"status": "ok"})


def config(_request):
    """Konfiguratsiya-asoslangan brending (SPEC §9.2 `/api/config/`).

    Hozircha statik placeholder; Faza 8'da `billing.BrandingConfig` / institut
    bo'yicha dinamik bo'ladi (bir platforma — ko'p brending).
    """
    return JsonResponse(
        {
            "brand": {
                "name": "SKAZKA",
                "mascot": "Mishka",
                "locale_default": "uz",
                "target_locale": "ru",
            },
            "features": {},
        }
    )


# Faza oshgani sari app router/url'lari shu ro'yxatga qo'shiladi.
api_v1: list = []

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/config/", config),
    # OpenAPI (drf-spectacular)
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    *api_v1,
]
