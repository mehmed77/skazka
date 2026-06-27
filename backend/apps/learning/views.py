"""learning API — SRS event (idempotent) + sessiya navbati (due). Bola-kontekst token."""

from rest_framework import permissions
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.models import ChildProfile
from apps.content.models import Word
from apps.content.serializers import ResolvedWordSerializer

from .serializers import EventInputSerializer
from .services import get_due, record_event


def _active_child(request) -> ChildProfile:
    """Bola-kontekst token'dan active_child_id → ota-onaning o'z bolasi (aks holda 403).

    (content._active_child bilan bir xil — app self-contained bo'lsin uchun takrorlangan.)
    """
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


class EventView(APIView):
    """POST /api/v1/learning/event/ — IDEMPOTENT event yozish (event_id kaliti)."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "learning"

    def post(self, request):
        child = _active_child(request)
        ser = EventInputSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ev, created = record_event(child, ser.validated_data)
        # Dublikat (idempotent) → state QAYTA o'zgarmagan; baribir 200.
        return Response({"event_id": str(ev.event_id), "idempotent": not created})


class SessionView(APIView):
    """GET /api/v1/learning/session/ — muddati kelgan (due) itemlar (frontend interleave qiladi)."""

    permission_classes = [permissions.IsAuthenticated]
    throttle_scope = "learning"

    def get(self, request):
        child = _active_child(request)
        states = get_due(child, limit=8)
        ids = [s.item_id for s in states]
        words = {str(w.id): w for w in Word.objects.filter(id__in=ids)}
        ordered = [words[str(i)] for i in ids if str(i) in words]  # due tartibini saqlaydi
        due = ResolvedWordSerializer(ordered, many=True, context={"request": request}).data
        return Response({"due": due, "count": len(due)})
