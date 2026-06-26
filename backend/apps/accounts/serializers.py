"""accounts serializerlari — ota-ona auth va bola profillari."""

import re

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import ChildProfile, ParentAccount, normalize_phone


class ParentSerializer(serializers.ModelSerializer):
    """Joriy ota-ona (me) — minimal ko'rinish."""

    class Meta:
        model = ParentAccount
        fields = ["id", "phone", "email", "full_name", "locale"]
        read_only_fields = ["id"]


def _parent_tokens(parent: ParentAccount) -> dict:
    refresh = RefreshToken.for_user(parent)
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


class RegisterSerializer(serializers.Serializer):
    """Ota-ona ro'yxati — telefon YOKI email + parol."""

    phone = serializers.CharField(max_length=32, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    full_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)
    locale = serializers.CharField(max_length=8, required=False, default="uz")

    def validate(self, attrs):
        phone = normalize_phone(attrs.get("phone")) or ""
        email = (attrs.get("email") or "").strip().lower()
        if not phone and not email:
            raise serializers.ValidationError(
                "Telefon yoki email — kamida bittasi majburiy."
            )
        # Django parol validatorlari (AUTH_PASSWORD_VALIDATORS) — DRF avtomatik chaqirmaydi
        try:
            validate_password(attrs["password"])
        except DjangoValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)}) from e
        if phone and ParentAccount.objects.filter(phone=phone).exists():
            raise serializers.ValidationError(
                {"phone": "Bu telefon allaqachon ro'yxatda."}
            )
        if email and ParentAccount.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                {"email": "Bu email allaqachon ro'yxatda."}
            )
        attrs["phone"] = phone or None
        attrs["email"] = email or None
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        return ParentAccount.objects.create_user(password=password, **validated_data)


class LoginSerializer(serializers.Serializer):
    """Telefon YOKI email + parol → JWT."""

    login = serializers.CharField(help_text="telefon yoki email")
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        ident = (attrs["login"] or "").strip()
        # Telefon normalizatsiyasi (login ham ro'yxat bilan bir xil ko'rinishda qidirsin)
        parent = ParentAccount.objects.filter(
            Q(phone=normalize_phone(ident)) | Q(email__iexact=ident)
        ).first()
        if not parent or not parent.check_password(attrs["password"]):
            raise serializers.ValidationError("Telefon/email yoki parol noto'g'ri.")
        if not parent.is_active:
            raise serializers.ValidationError("Akkaunt faol emas.")
        self.parent = parent
        return attrs

    def to_representation(self, _instance):
        return {
            **_parent_tokens(self.parent),
            "parent": ParentSerializer(self.parent).data,
        }


class ChildProfileSerializer(serializers.ModelSerializer):
    """Bola profili — PIN faqat yoziladi (write-only, hash'lanadi), hech qachon qaytmaydi."""

    has_pin = serializers.BooleanField(read_only=True)
    pin = serializers.CharField(
        write_only=True, required=False, allow_blank=True, max_length=32
    )

    class Meta:
        model = ChildProfile
        fields = [
            "id",
            "display_name",
            "avatar_id",
            "age_band",
            "l1_locale",
            "is_active",
            "has_pin",
            "pin",
            "created_at",
        ]
        read_only_fields = ["id", "has_pin", "created_at"]

    def validate_pin(self, value):
        # Bo'sh (PINsiz) yoki aniq 4 ta raqam (frontend bilan bir xil)
        if value and not re.fullmatch(r"\d{4}", value):
            raise serializers.ValidationError(
                "PIN aniq 4 ta raqamdan iborat bo'lishi kerak."
            )
        return value

    def create(self, validated_data):
        raw_pin = validated_data.pop("pin", "")
        # parent — view'da context orqali (payload'dan EMAS — boshqa ota-onaga yozib bo'lmaydi)
        child = ChildProfile(parent=self.context["request"].user, **validated_data)
        child.set_pin(raw_pin)
        child.save()
        return child

    def update(self, instance, validated_data):
        raw_pin = validated_data.pop("pin", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if raw_pin is not None:
            instance.set_pin(raw_pin)
        instance.save()
        return instance


class EnterSerializer(serializers.Serializer):
    """Bola profiliga kirish — ixtiyoriy PIN."""

    pin = serializers.CharField(required=False, allow_blank=True, max_length=32)
