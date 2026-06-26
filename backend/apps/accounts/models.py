"""accounts — ota-ona akkaunti (custom user) va bola profillari (SPEC §8, §2.8).

Maqola custom-user naqshi: AbstractBaseUser + PermissionsMixin + BaseUserManager.
SKAZKA farqi: identifikator telefon YOKI email (O'zbekiston — telefon birlamchi);
bolada login/email YO'Q, ma'lumot minimal (COPPA/GDPR-K ruhi).
"""

import re
import uuid

from django.contrib.auth.hashers import check_password, make_password
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.core.exceptions import ValidationError
from django.db import models

from apps.common.models import BaseModel


def normalize_phone(raw: str | None) -> str | None:
    """Telefonni bir ko'rinishga keltiradi (bo'sh joy/chiziq/qavslarni olib tashlaydi).

    '+998 90 123 45 67' va '+998901234567' bir xil saqlanadi — dublikat akkauntlarni
    va Faza 2 SMS tasdiqida ziddiyatni oldini oladi.
    """
    if not raw:
        return None
    cleaned = re.sub(r"[^\d+]", "", raw)
    return cleaned or None


class ParentManager(BaseUserManager):
    """Telefon yoki email asosidagi ota-ona akkaunti menejeri."""

    use_in_migrations = True

    def _create_user(self, phone=None, email=None, password=None, **extra):
        if not phone and not email:
            raise ValueError("Telefon yoki email — kamida bittasi majburiy")
        email = self.normalize_email(email) if email else None
        phone = normalize_phone(phone)
        user = self.model(phone=phone, email=email, **extra)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone=None, email=None, password=None, **extra):
        extra.setdefault("is_staff", False)
        extra.setdefault("is_superuser", False)
        return self._create_user(phone, email, password, **extra)

    def create_superuser(self, phone=None, email=None, password=None, **extra):
        extra.setdefault("is_staff", True)
        extra.setdefault("is_superuser", True)
        if extra["is_staff"] is not True or extra["is_superuser"] is not True:
            raise ValueError("Superuser is_staff=is_superuser=True bo'lishi kerak")
        return self._create_user(phone, email, password, **extra)


class ParentAccount(AbstractBaseUser, PermissionsMixin):
    """Ota-ona akkaunti — telefon/email + parol bilan kiradi. Bir ota-ona → ko'p bola."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(
        "telefon", max_length=32, unique=True, null=True, blank=True
    )
    email = models.EmailField("email", unique=True, null=True, blank=True)
    full_name = models.CharField("F.I.Sh.", max_length=255, blank=True)
    locale = models.CharField("til", max_length=8, default="uz")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = ParentManager()

    # Telefon birlamchi identifikator (admin/createsuperuser uchun); login esa
    # telefon YOKI email bilan ishlaydi (LoginSerializer).
    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS: list[str] = []

    class Meta:
        verbose_name = "Ota-ona akkaunti"
        verbose_name_plural = "Ota-ona akkauntlari"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.full_name or self.phone or self.email or str(self.id)

    def clean(self):
        super().clean()
        if not self.phone and not self.email:
            raise ValidationError("Telefon yoki email — kamida bittasi majburiy.")


class AgeBand(models.TextChoices):
    """Yosh diapazoni — murakkablikni boshqaradi (SPEC §2.8)."""

    Y3_4 = "3-4", "3–4 yosh"
    Y5_6 = "5-6", "5–6 yosh"
    Y6_7 = "6-7", "6–7 yosh"


# Oldindan tayyor avatarlar to'plami (bola rasm YUKLAMAYDI — faqat kalit tanlaydi).
AVATAR_CHOICES = [
    ("mishka", "Mishka (ayiq)"),
    ("zayka", "Zayka (quyon)"),
    ("kotik", "Kotik (mushuk)"),
    ("sobachka", "Sobachka (kuchuk)"),
    ("lisichka", "Lisichka (tulki)"),
    ("ptichka", "Ptichka (qush)"),
]


class ChildProfile(BaseModel):
    """Bola profili — ota-ona sessiyasi ichida. Login/email yo'q, ma'lumot minimal."""

    parent = models.ForeignKey(
        ParentAccount,
        on_delete=models.CASCADE,
        related_name="children",
        verbose_name="ota-ona",
    )
    display_name = models.CharField("ism / taxallus", max_length=64)
    avatar_id = models.CharField(
        "avatar", max_length=32, choices=AVATAR_CHOICES, default="mishka"
    )
    age_band = models.CharField(
        "yosh diapazoni", max_length=8, choices=AgeBand.choices, default=AgeBand.Y3_4
    )
    l1_locale = models.CharField("ona tili", max_length=8, default="uz")
    pin = models.CharField("PIN (hash)", max_length=128, blank=True, default="")
    is_active = models.BooleanField(default=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Bola profili"
        verbose_name_plural = "Bola profillari"

    def __str__(self) -> str:
        return f"{self.display_name} ({self.age_band})"

    # ── PIN ── (ochiq matnda saqlanmaydi)
    @property
    def has_pin(self) -> bool:
        return bool(self.pin)

    def set_pin(self, raw_pin: str | None) -> None:
        self.pin = make_password(raw_pin) if raw_pin else ""

    def check_pin(self, raw_pin: str | None) -> bool:
        if not self.pin:
            return True  # PIN o'rnatilmagan — kirish ochiq
        return check_password(raw_pin or "", self.pin)
