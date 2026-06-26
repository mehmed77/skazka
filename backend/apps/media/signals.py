"""Media yuklanganda ishlov taskini avtomatik navbatga (tolerant)."""

import logging

from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Media
from .tasks import normalize_audio, optimize_image

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Media)
def enqueue_media_processing(sender, instance, created, update_fields=None, **kwargs):
    # Task o'zi yozgan saqlash (update_fields bor, lekin 'file' yo'q) → qayta enqueue qilmaymiz
    # (cheksiz loop oldini olish). Faylsiz media — ishlov yo'q.
    if update_fields and "file" not in update_fields:
        return
    if not instance.file:
        return

    def _enqueue():
        try:
            if instance.kind == "audio":
                normalize_audio.delay(str(instance.id))
            elif instance.kind == "image":
                optimize_image.delay(str(instance.id))
        except (
            Exception
        ) as exc:  # noqa: BLE001 — broker yo'q bo'lsa ham save to'xtamasin
            logger.warning("media enqueue muvaffaqiyatsiz (%s): %s", instance.id, exc)

    transaction.on_commit(_enqueue)
