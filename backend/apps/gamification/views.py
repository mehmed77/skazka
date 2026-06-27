"""gamification API — bola-kontekst: o'rmon dunyosi (mukofot) + vaqt tekshiruvi."""

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import ChildProfile

from .models import ChildAchievement, ChildForestElement, ChildMishkaItem
from .services import evaluate_rewards, mark_rewards_seen, minutes_today


def _active_child(request) -> ChildProfile:
    """Bola-kontekst token'dan active_child_id → ota-onaning o'z bolasi (aks holda 403)."""
    payload = getattr(request.auth, "payload", None) or {}
    child_id = payload.get("active_child_id")
    if not child_id:
        raise PermissionDenied("Bola-kontekst token kerak — avval profilga kiring.")
    child = ChildProfile.objects.filter(id=child_id, parent=request.user).first()
    if not child:
        raise PermissionDenied("Bola topilmadi yoki sizga tegishli emas.")
    return child


class ForestView(APIView):
    """GET /api/v1/gamification/forest/ — ochilgan elementlar/Mishka/yutuqlar + yangi (new) belgisi.

    evaluate_rewards (MAVJUD SRS'dan, idempotent) ishlatiladi. GET FAQAT O'QIYDI (idempotent, race
    yo'q): `new=not seen` qaytaradi, LEKIN seen'ni o'zgartirmaydi. "Ko'rildi" deb belgilash alohida
    POST /forest/seen/ (ResultView "yangi do'st!" ko'rsatgach bir marta chaqiradi).
    """

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "content"

    def get(self, request):
        child = _active_child(request)
        evaluate_rewards(child)

        forest = list(
            ChildForestElement.objects.filter(child=child).select_related("element")
        )
        mishka = list(
            ChildMishkaItem.objects.filter(child=child).select_related("item")
        )
        ach = list(
            ChildAchievement.objects.filter(child=child).select_related("achievement")
        )

        elements = [
            {
                "key": c.element.key,
                "title_uz": c.element.title_uz,
                "title_ru": c.element.title_ru,
                "asset": c.element.asset_slot,
                "new": not c.seen,
            }
            for c in forest
        ]
        mishka_items = [
            {
                "key": c.item.key,
                "title_uz": c.item.title_uz,
                "title_ru": c.item.title_ru,
                "slot": c.item.slot,
                "asset": c.item.asset_slot,
                "new": not c.seen,
            }
            for c in mishka
        ]
        achievements = [
            {
                "key": c.achievement.key,
                "title_uz": c.achievement.title_uz,
                "title_ru": c.achievement.title_ru,
                "icon": c.achievement.icon,
                "category": c.achievement.category,
                "new": not c.seen,
            }
            for c in ach
        ]
        # Yangi ochilganlar (natija ekrani uchun) — keyin "ko'rilgan" deb belgilanadi
        recent = (
            [
                {
                    "kind": "forest",
                    "title_uz": e["title_uz"],
                    "title_ru": e["title_ru"],
                    "asset": e["asset"],
                }
                for e in elements
                if e["new"]
            ]
            + [
                {
                    "kind": "mishka",
                    "title_uz": m["title_uz"],
                    "title_ru": m["title_ru"],
                    "asset": m["asset"],
                }
                for m in mishka_items
                if m["new"]
            ]
            + [
                {
                    "kind": "achievement",
                    "title_uz": a["title_uz"],
                    "title_ru": a["title_ru"],
                    "asset": a["icon"],
                }
                for a in achievements
                if a["new"]
            ]
        )
        # GET O'QIYDI, belgilamaydi (idempotent). "Ko'rildi" → POST /forest/seen/ (SeenView).
        streak = getattr(child, "streak", None)
        return Response(
            {
                "elements": elements,
                "mishka": mishka_items,
                "achievements": achievements,
                "recent": recent,
                "streak": {
                    "current": streak.current if streak else 0,
                    "longest": streak.longest if streak else 0,
                },
            }
        )


class SeenView(APIView):
    """POST /api/v1/gamification/forest/seen/ — "yangi" mukofotlarni ko'rilgan deb belgilaydi.

    ResultView "yangi do'st!" ko'rsatgach bir marta chaqiradi (GET endi belgilamaydi → idempotent).
    """

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "content"

    def post(self, request):
        child = _active_child(request)
        mark_rewards_seen(child)
        return Response({"ok": True})


class TimeCheckView(APIView):
    """GET /api/v1/gamification/timecheck/ — bugungi faol vaqt vs kunlik limit (yumshoq cheklov)."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "content"

    def get(self, request):
        child = _active_child(request)
        limit = child.daily_limit_minutes
        mins = minutes_today(child)
        # limit=0 → "o'yin yo'q" (doim exceeded); None → cheksiz. (truthy emas — is not None)
        return Response(
            {
                "minutes_today": mins,
                "limit": limit,
                "exceeded": limit is not None and mins >= limit,
            }
        )
