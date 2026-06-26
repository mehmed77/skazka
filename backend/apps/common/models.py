"""Umumiy abstrakt modellar — barcha domen modellari shulardan meros oladi."""

import uuid

from django.db import models


class UUIDModel(models.Model):
    """UUID birlamchi kalit (tashqi ID'lar bashorat qilinmasin)."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    class Meta:
        abstract = True


class TimeStampedModel(models.Model):
    """`created_at` / `updated_at` vaqt belgilari."""

    created_at = models.DateTimeField("yaratilgan", auto_now_add=True)
    updated_at = models.DateTimeField("yangilangan", auto_now=True)

    class Meta:
        abstract = True


class BaseModel(UUIDModel, TimeStampedModel):
    """SKAZKA domen modellari uchun standart asos (UUID + vaqt belgilari)."""

    class Meta:
        abstract = True
        ordering = ["-created_at"]
