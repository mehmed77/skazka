"""media — audio/rasm/lottie aktivlari (SPEC §7.3, §10).

MinIO/S3 sozlamasi `config.settings` da tayyor (default storage = S3Storage,
`skazka-media` bucket). Kontent modellaridagi media FK'lari NULLABLE — real jonli
ovoz/rasm kontent-ishlab chiqarish vazifasi, kod fazasi emas (seed media'siz ishlaydi).
"""

import os
import uuid

from django.core.exceptions import ValidationError
from django.db import models

from apps.common.models import BaseModel

# Public bucket — faqat xavfsiz turlar. SVG ATAYLAB bloklangan (SVG-XSS riski).
ALLOWED_MEDIA_EXTS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",  # rasm
    ".mp3",
    ".ogg",
    ".wav",
    ".m4a",
    ".aac",  # audio
    ".json",  # lottie
}
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".gif"}
MAX_MEDIA_BYTES = 25 * 1024 * 1024  # 25 MB — DoS oldini olish
MAX_IMAGE_PIXELS = 40_000_000  # ~40MP — decompression bomb chegarasi


def validate_media_file(f) -> None:
    """Yuklashda: (1) kengaytma allowlist (SVG yo'q), (2) hajm, (3) rasm uchun KONTENT
    tekshiruvi — SVG-XSS ni rasm kengaytmasi bilan aylanib o'tishni bloklaydi + bomba.
    """
    ext = os.path.splitext(f.name)[1].lower()
    if ext not in ALLOWED_MEDIA_EXTS:
        raise ValidationError(
            f"Ruxsat etilmagan fayl turi: '{ext}'. SVG va bilinmagan turlar bloklangan."
        )
    if getattr(f, "size", None) and f.size > MAX_MEDIA_BYTES:
        raise ValidationError("Fayl juda katta (maksimum 25 MB).")
    # Rasm bo'lsa — kengaytmaga ishonmaymiz, KONTENTni PIL bilan tekshiramiz
    # (SVG/skript .png nomi bilan kelsa — PIL ocholmaydi → rad). MAX_IMAGE_PIXELS bombani to'xtatadi.
    if ext in IMAGE_EXTS and hasattr(f, "read"):
        from PIL import Image

        Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
        try:
            f.seek(0)
            Image.open(f).verify()  # haqiqiy raster? (SVG/buzilgan/bomba → xato)
        except Exception as exc:  # noqa: BLE001
            raise ValidationError(
                "Fayl haqiqiy rasm emas (SVG/buzilgan/juda katta o'lcham bloklandi)."
            ) from exc
        finally:
            try:
                f.seek(0)
            except Exception:  # noqa: BLE001
                pass


def media_upload_to(instance, filename: str) -> str:
    """Topib bo'lmaydigan UUID kalit (storage_key) — public bucket xavfsizroq."""
    ext = os.path.splitext(filename)[1].lower()
    return f"content/{uuid.uuid4().hex}{ext}"


class MediaKind(models.TextChoices):
    AUDIO = "audio", "Audio"
    IMAGE = "image", "Rasm"
    LOTTIE = "lottie", "Lottie"


class Media(BaseModel):
    kind = models.CharField("tur", max_length=8, choices=MediaKind.choices)
    title = models.CharField("nom", max_length=200, blank=True)
    # S3/MinIO ga yuklanadi (default storage). Bo'sh bo'lishi mumkin (placeholder).
    file = models.FileField(
        "fayl", upload_to=media_upload_to, blank=True, validators=[validate_media_file]
    )
    duration_ms = models.PositiveIntegerField(
        "davomiylik (ms)", null=True, blank=True, help_text="Audio uchun"
    )
    meta = models.JSONField("meta", default=dict, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Media"
        verbose_name_plural = "Media"

    def __str__(self) -> str:
        return self.title or f"{self.get_kind_display()} · {self.id}"
