"""gamification — ichki-yo'naltirilgan motivatsiya (SPEC §6). "O'rmonni jonlantirish".

Anti-naqsh: ball/liderboard/XP YO'Q (§6.3). Mukofot = yig'iladigan dunyo + Mishka + yutuq.
Hammasi MAVJUD SRS ma'lumotidan hisoblanadi (yangi o'rganish emas). evaluate_rewards idempotent.

Katalog (Achievement/ForestElement/MishkaItem) data-driven: rule_json ochilish shartini tavsiflaydi
(masalan {"type":"words_receptive","count":10}). Child× modellar `seen` bayrog'i bilan — "yangi
ochilgan"ni natija ekranida bir marta ko'rsatish uchun.
"""

from django.db import models

from apps.common.models import BaseModel


class RewardCategory(models.TextChoices):
    MILESTONE = "milestone", "Bosqich"
    THEME = "theme", "Mavzu"
    STREAK = "streak", "Ketma-ketlik"
    ALPHABET = "alphabet", "Alifbo"


# ── Yutuq (achievement) — "men yangi narsa bila olaman" hissi ──
class Achievement(BaseModel):
    key = models.SlugField("kalit", max_length=48, unique=True)
    title_uz = models.CharField("nom (uz)", max_length=120)
    title_ru = models.CharField("nom (ru)", max_length=120, blank=True)
    category = models.CharField(
        "kategoriya",
        max_length=16,
        choices=RewardCategory.choices,
        default=RewardCategory.MILESTONE,
    )
    icon = models.CharField("ikona (placeholder)", max_length=8, default="🏅")
    rule_json = models.JSONField("ochilish sharti", default=dict)  # {"type":..., ...}
    order = models.PositiveIntegerField("tartib", default=1)

    class Meta(BaseModel.Meta):
        ordering = ["order", "key"]
        verbose_name = "Yutuq"
        verbose_name_plural = "Yutuqlar"

    def __str__(self) -> str:
        return f"{self.title_uz} ({self.key})"


class ChildAchievement(BaseModel):
    child = models.ForeignKey(
        "accounts.ChildProfile", on_delete=models.CASCADE, related_name="achievements"
    )
    achievement = models.ForeignKey(
        Achievement, on_delete=models.CASCADE, related_name="+"
    )
    seen = models.BooleanField(
        "ko'rilgan", default=False
    )  # natija ekranida "yangi" → keyin ko'rilgan

    class Meta(BaseModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["child", "achievement"], name="uniq_child_achievement"
            )
        ]


# ── O'rmon elementi — yutuq bilan jonlanadigan bezak (asset slot) ──
class ForestElement(BaseModel):
    key = models.SlugField("kalit", max_length=48, unique=True)
    title_uz = models.CharField("nom (uz)", max_length=120)
    title_ru = models.CharField("nom (ru)", max_length=120, blank=True)
    asset_slot = models.CharField("asset (placeholder)", max_length=8, default="🌳")
    rule_json = models.JSONField("ochilish sharti", default=dict)
    order = models.PositiveIntegerField("tartib", default=1)

    class Meta(BaseModel.Meta):
        ordering = ["order", "key"]
        verbose_name = "O'rmon elementi"
        verbose_name_plural = "O'rmon elementlari"

    def __str__(self) -> str:
        return f"{self.title_uz} ({self.key})"


class ChildForestElement(BaseModel):
    child = models.ForeignKey(
        "accounts.ChildProfile",
        on_delete=models.CASCADE,
        related_name="forest_elements",
    )
    element = models.ForeignKey(
        ForestElement, on_delete=models.CASCADE, related_name="+"
    )
    seen = models.BooleanField("ko'rilgan", default=False)

    class Meta(BaseModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["child", "element"], name="uniq_child_forest_element"
            )
        ]


# ── Mishka customization (shapka/sharf/ko'zoynak) ──
class MishkaItem(BaseModel):
    key = models.SlugField("kalit", max_length=48, unique=True)
    title_uz = models.CharField("nom (uz)", max_length=120)
    title_ru = models.CharField("nom (ru)", max_length=120, blank=True)
    slot = models.CharField("slot", max_length=16, default="hat")  # hat|scarf|glasses
    asset_slot = models.CharField("asset (placeholder)", max_length=8, default="🎩")
    rule_json = models.JSONField("ochilish sharti", default=dict)
    order = models.PositiveIntegerField("tartib", default=1)

    class Meta(BaseModel.Meta):
        ordering = ["order", "key"]
        verbose_name = "Mishka buyumi"
        verbose_name_plural = "Mishka buyumlari"

    def __str__(self) -> str:
        return f"{self.title_uz} ({self.key})"


class ChildMishkaItem(BaseModel):
    child = models.ForeignKey(
        "accounts.ChildProfile", on_delete=models.CASCADE, related_name="mishka_items"
    )
    item = models.ForeignKey(MishkaItem, on_delete=models.CASCADE, related_name="+")
    seen = models.BooleanField("ko'rilgan", default=False)

    class Meta(BaseModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["child", "item"], name="uniq_child_mishka_item"
            )
        ]


# ── Streak (§6.3 — bolaga AYBLOV emas; asosan ota-ona paneliga) ──
class StreakRecord(BaseModel):
    child = models.OneToOneField(
        "accounts.ChildProfile", on_delete=models.CASCADE, related_name="streak"
    )
    current = models.PositiveIntegerField("joriy ketma-ketlik", default=0)
    longest = models.PositiveIntegerField("eng uzun", default=0)
    last_active_date = models.DateField("oxirgi faol kun", null=True, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Streak"
        verbose_name_plural = "Streaklar"
