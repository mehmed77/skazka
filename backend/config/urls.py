"""SKAZKA — asosiy URL marshrutlari."""

from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import DefaultRouter

from apps.accounts.views import ChildProfileViewSet


def health(_request):
    """Liveness probe — Docker/monitoring uchun."""
    return JsonResponse({"status": "ok"})


def config(_request):
    """Konfiguratsiya-asoslangan brending (SPEC §9.2 `/api/config/`).

    Hozircha statik placeholder; keyinroq `billing.BrandingConfig` / institut
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


_profiles_router = DefaultRouter()
_profiles_router.register("profiles", ChildProfileViewSet, basename="profile")

# /api/v1/ ostidagi versiyalangan API
api_v1 = [
    path("auth/", include("apps.accounts.urls")),
    *_profiles_router.urls,
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/health/", health),
    path("api/config/", config),
    # OpenAPI (drf-spectacular) — include'dan oldin (aniq yo'l ustun)
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/v1/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/v1/", include((api_v1, "api"), namespace="v1")),
]
