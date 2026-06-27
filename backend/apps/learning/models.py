"""learning — ko'rinmas SRS dvigateli (SPEC §4) — platformaning yuragi.

Faza 6:
- ItemState: bola × item (POLIMORFIK: word|letter) xotira holati. FSRS-TAYYOR maydonlar
  (stability/difficulty/due_at/reps/lapses) + reseptiv/ekspressiv kuch (§4.3). Interval mantig'i
  ALOHIDA — `scheduler.schedule()` (almashtiriladigan; ADR-013).
- LearningEvent: har o'zaro ta'sir. `event_id` (UUID, unique) — IDEMPOTENTLIK kaliti (outbox
  sync bir xil eventni ikki marta yuborsa, state QAYTA o'zgarmaydi).
"""

from django.db import models
from django.utils import timezone

from apps.common.models import BaseModel


class ItemType(models.TextChoices):
    WORD = "word", "So'z"
    LETTER = "letter", "Harf"  # Faza 7 SHU modelni ishlatadi (alohida model emas)


class ItemState(BaseModel):
    """Bola × item xotira holati. unique(child, item_type, item_id)."""

    child = models.ForeignKey(
        "accounts.ChildProfile",
        on_delete=models.CASCADE,
        related_name="item_states",
        verbose_name="bola",
    )
    item_type = models.CharField("tur", max_length=8, choices=ItemType.choices)
    item_id = models.UUIDField("item id")

    # ── FSRS-tayyor maydonlar (MVP: scheduler.schedule() konservativ ishlatadi) ──
    stability = models.FloatField("barqarorlik (kun)", default=0.0)
    difficulty = models.FloatField("qiyinlik", default=0.3)
    due_at = models.DateTimeField("muddati", default=timezone.now, db_index=True)
    last_reviewed_at = models.DateTimeField("oxirgi takror", null=True, blank=True)
    reps = models.PositiveIntegerField("muvaffaqiyatli takrorlar", default=0)
    lapses = models.PositiveIntegerField("unutishlar", default=0)

    # ── Mastery (§4.3): reseptiv (tanib olish) ALOHIDA ekspressiv (aytib berish) ──
    receptive_strength = models.FloatField("reseptiv kuch", default=0.0)  # 0..1, hozir haydaladi
    expressive_strength = models.FloatField("ekspressiv kuch", default=0.0)  # Faza 7/9 to'ldiradi

    exposures = models.PositiveIntegerField("ko'rishlar", default=0)
    last_result = models.BooleanField("oxirgi natija", null=True, blank=True)

    class Meta:
        verbose_name = "Item holati (SRS)"
        verbose_name_plural = "Item holatlari (SRS)"
        constraints = [
            models.UniqueConstraint(
                fields=["child", "item_type", "item_id"], name="uniq_child_item_state"
            )
        ]
        indexes = [models.Index(fields=["child", "due_at"])]

    def __str__(self) -> str:
        return f"{self.child_id}:{self.item_type}:{self.item_id} due={self.due_at:%Y-%m-%d}"


class LearningEvent(BaseModel):
    """Har o'zaro ta'sir. event_id (client-generated UUID) — IDEMPOTENTLIK kaliti."""

    event_id = models.UUIDField("event id (idempotentlik)", unique=True, db_index=True)
    child = models.ForeignKey(
        "accounts.ChildProfile",
        on_delete=models.CASCADE,
        related_name="learning_events",
        verbose_name="bola",
    )
    item_type = models.CharField("tur", max_length=8, choices=ItemType.choices)
    item_id = models.UUIDField("item id")
    game_type = models.CharField("o'yin turi", max_length=32, blank=True, default="")
    is_correct = models.BooleanField("to'g'ri", default=False)
    latency_ms = models.PositiveIntegerField("kechikish (ms)", null=True, blank=True)
    hint_used = models.BooleanField("maslahat ishlatildi", default=False)
    session_id = models.CharField("sessiya id", max_length=64, blank=True, default="")
    ts = models.DateTimeField("vaqt", default=timezone.now, db_index=True)

    class Meta:
        verbose_name = "O'rganish hodisasi"
        verbose_name_plural = "O'rganish hodisalari"
        indexes = [models.Index(fields=["child", "ts"])]

    def __str__(self) -> str:
        return f"{self.child_id}:{self.item_type}:{self.item_id} ok={self.is_correct}"
