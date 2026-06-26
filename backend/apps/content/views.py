"""content API — kurikulum daraxti va to'liq dars (bola-kontekst, kesh, ETag).

Bola-kontekst token (`enter` chiqargan) `active_child_id` claim'iga tayanadi.
"""

from django.core.cache import cache
from django.http import Http404
from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import ChildProfile

from .cache import content_version
from .models import Language, Lesson, Level
from .serializers import (
    AGE_RANK,
    CurriculumLevelSerializer,
    LessonDetailSerializer,
)


def _active_child(request) -> ChildProfile:
    """Bola-kontekst token'dan active_child_id → ota-onaning o'z bolasi (aks holda 403)."""
    payload = getattr(request.auth, "payload", None) or {}
    child_id = payload.get("active_child_id")
    if not child_id:
        raise PermissionDenied(
            "Bola-kontekst token kerak — avval profilga kiring (/profiles/{id}/enter/)."
        )
    child = ChildProfile.objects.filter(id=child_id, parent=request.user).first()
    if not child:
        raise PermissionDenied("Bola topilmadi yoki sizga tegishli emas.")
    return child


class CurriculumView(APIView):
    """GET /api/v1/curriculum/ — bola age_band'iga mos Level→Theme→Lesson daraxti."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "content"

    def get(self, request):
        child = _active_child(request)
        version = content_version()
        etag = f'W/"curr-{child.id}-{version}"'
        if request.headers.get("If-None-Match") == etag:
            return Response(status=304)

        # age_band'ga bog'liq (bola-independent) daraxt — age_band bo'yicha keshlanadi
        cache_key = f"curriculum:ru:{child.age_band}:v{version}"
        levels_data = cache.get(cache_key)
        if levels_data is None:
            lang = Language.objects.filter(code="ru").first()
            levels = (
                Level.objects.filter(language=lang)
                .prefetch_related("themes__lessons")
                .order_by("order")
                if lang
                else Level.objects.none()
            )
            levels_data = CurriculumLevelSerializer(
                levels,
                many=True,
                context={
                    "request": request,
                    "age_rank": AGE_RANK.get(child.age_band, 0),
                },
            ).data
            cache.set(cache_key, levels_data, 3600)

        data = {
            "child": {
                "id": str(child.id),
                "display_name": child.display_name,
                "age_band": child.age_band,
            },
            "language": "ru",
            "levels": levels_data,
        }
        resp = Response(data)
        resp["ETag"] = etag
        return resp


class LessonView(APIView):
    """GET /api/v1/lesson/{id}/ — to'liq dars: RESOLVE qilingan steplar + media + games."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "content"

    def get(self, request, pk):
        child = _active_child(request)
        lesson = (
            Lesson.objects.filter(id=pk)
            .select_related("theme")
            .prefetch_related("steps")
            .first()
        )
        if not lesson:
            raise Http404("Dars topilmadi.")
        # age_band mosligi
        if AGE_RANK.get(lesson.min_age_band, 0) > AGE_RANK.get(child.age_band, 0):
            raise PermissionDenied("Bu dars bolaning yoshiga mos emas.")

        version = content_version()
        etag = f'W/"lesson-{pk}-{version}"'
        if request.headers.get("If-None-Match") == etag:
            return Response(status=304)

        # Dars kontenti bola-independent → lesson id bo'yicha keshlanadi
        cache_key = f"lesson:{pk}:v{version}"
        data = cache.get(cache_key)
        if data is None:
            data = LessonDetailSerializer(lesson, context={"request": request}).data
            cache.set(cache_key, data, 3600)

        resp = Response(data)
        resp["ETag"] = etag
        return resp
