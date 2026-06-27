"""accounts ko'rinishlari — ota-ona auth va bola profillari."""

from rest_framework import generics, permissions, serializers, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ChildProfile
from .serializers import (
    ChildProfileSerializer,
    EnterSerializer,
    LoginSerializer,
    ParentSerializer,
    RegisterSerializer,
    _parent_tokens,
)


class IsParentToken(permissions.BasePermission):
    """Ota-ona zonasi — SOF ota-ona tokeni (bola-kontekst token RAD).

    Bola-kontekst token (enter mint qilgan, `active_child_id` claim'i bor) bilan ota-ona profil
    amallarini (CRUD, daily_limit PATCH, progress) bajarib bo'lmaydi — bola o'zi limitni uzaytira
    olmasin (§8, Parent Gate ortida). Bola zonasi endpointlari (content/learning/gamification)
    aksincha `active_child_id` TALAB qiladi.
    """

    message = "Bu amal ota-ona tokeni bilan bajariladi (bola-kontekst token emas)."

    def has_permission(self, request, view):
        payload = getattr(request.auth, "payload", None) or {}
        return "active_child_id" not in payload


class RegisterView(generics.GenericAPIView):
    """Ota-ona ro'yxati → akkaunt + JWT (avtomatik kirish)."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "register"

    def post(self, request):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        parent = ser.save()
        return Response(
            {**_parent_tokens(parent), "parent": ParentSerializer(parent).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(generics.GenericAPIView):
    """Telefon/email + parol → JWT."""

    serializer_class = LoginSerializer
    permission_classes = [permissions.AllowAny]
    throttle_scope = "login"

    def post(self, request):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        return Response(ser.to_representation(None))


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class LogoutView(generics.GenericAPIView):
    """Refresh tokenni blacklist qiladi (chiqish)."""

    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        ser = self.get_serializer(data=request.data)
        ser.is_valid(raise_exception=True)
        try:
            RefreshToken(ser.validated_data["refresh"]).blacklist()
        except Exception:  # noqa: BLE001 — yaroqsiz/eskirgan token ham OK chiqish
            pass
        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(generics.RetrieveAPIView):
    """Joriy ota-ona ma'lumotlari."""

    serializer_class = ParentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChildProfileViewSet(viewsets.ModelViewSet):
    """Bola profillari CRUD — faqat o'z bolalari (object-level izolyatsiya)."""

    serializer_class = ChildProfileSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsParentToken,
    ]  # bola-kontekst token RAD

    def get_throttles(self):
        # enter → PIN brute-force himoyasi (qattiqroq); CRUD → profiles
        self.throttle_scope = "pin_entry" if self.action == "enter" else "profiles"
        return super().get_throttles()

    def get_queryset(self):
        # Begona ota-onaning bolasi navbatga umuman tushmaydi → 404.
        return ChildProfile.objects.filter(parent=self.request.user)

    @action(detail=True, methods=["post"])
    def enter(self, request, pk=None):
        """Bola profiliga kirish → bola-kontekst access token."""
        child = self.get_object()  # get_queryset orqali egalik tekshirilgan
        ser = EnterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        if not child.check_pin(ser.validated_data.get("pin")):
            return Response(
                {"pin": "PIN noto'g'ri."}, status=status.HTTP_400_BAD_REQUEST
            )
        # Bola-kontekst token: ota-ona uchun, lekin active_child_id claim bilan.
        access = RefreshToken.for_user(request.user).access_token
        access["parent_id"] = str(request.user.id)
        access["active_child_id"] = str(child.id)
        return Response(
            {
                "access": str(access),
                "child": ChildProfileSerializer(
                    child, context={"request": request}
                ).data,
            }
        )

    @action(detail=True, methods=["get"])
    def progress(self, request, pk=None):
        """Ota-ona paneli — REAL SRS rivoji (ota-ona JWT; egalik get_queryset orqali, begona bola 404)."""
        child = self.get_object()  # parent=request.user tekshirilgan
        from apps.gamification.services import child_progress

        return Response(child_progress(child))
