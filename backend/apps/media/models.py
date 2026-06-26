"""media — audio/rasm/lottie aktivlari (SPEC §7.3, §10).

MinIO/S3 sozlamasi `config.settings` da tayyor (default storage = S3Storage,
`skazka-media` bucket). Kontent modellaridagi media FK'lari NULLABLE — real jonli
ovoz/rasm kontent-ishlab chiqarish vazifasi, kod fazasi emas (seed media'siz ishlaydi).
"""

from django.db import models

from apps.common.models import BaseModel


class MediaKind(models.TextChoices):
    AUDIO = "audio", "Audio"
    IMAGE = "image", "Rasm"
    LOTTIE = "lottie", "Lottie"


class Media(BaseModel):
    kind = models.CharField("tur", max_length=8, choices=MediaKind.choices)
    title = models.CharField("nom", max_length=200, blank=True)
    # S3/MinIO ga yuklanadi (default storage). Bo'sh bo'lishi mumkin (placeholder).
    file = models.FileField("fayl", upload_to="content/", blank=True)
    duration_ms = models.PositiveIntegerField(
        "davomiylik (ms)", null=True, blank=True, help_text="Audio uchun"
    )
    meta = models.JSONField("meta", default=dict, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Media"
        verbose_name_plural = "Media"

    def __str__(self) -> str:
        return self.title or f"{self.get_kind_display()} · {self.id}"
