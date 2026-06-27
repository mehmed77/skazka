"""content — kurikulum va kontent katalogi (SPEC §3, §10).

Ikki trek: A (alifbo/fonetika — Letter) va B (tematik so'z boyligi — Word).
Hammasi `common.BaseModel` (UUID + vaqt). Media FK'lari NULLABLE (real audio/rasm — keyin).
Kontent data-driven: `LessonStep.config_json` qaysi so'z/harf + qaysi GameType ishlatilishini bog'laydi.
"""

from django.db import models

from apps.accounts.models import AgeBand
from apps.common.models import BaseModel
from apps.media.models import Media


# ── Kurikulum ierarxiyasi ────────────────────────────────────
class Language(BaseModel):
    code = models.CharField("kod", max_length=8, unique=True)  # ru, uz
    name = models.CharField("nom", max_length=64)

    class Meta(BaseModel.Meta):
        verbose_name = "Til"
        verbose_name_plural = "Tillar"

    def __str__(self) -> str:
        return f"{self.name} ({self.code})"


class Level(BaseModel):
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="levels", verbose_name="til"
    )
    order = models.PositiveIntegerField("tartib", default=1)
    title_uz = models.CharField("sarlavha (uz)", max_length=128)
    title_ru = models.CharField("sarlavha (ru)", max_length=128, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Daraja"
        verbose_name_plural = "Darajalar"
        ordering = ["language", "order"]

    def __str__(self) -> str:
        return f"L{self.order} · {self.title_uz}"


class Theme(BaseModel):
    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, related_name="themes", verbose_name="daraja"
    )
    order = models.PositiveIntegerField("tartib", default=1)
    key = models.SlugField("kalit", max_length=64)  # masalan "animals_home"
    title_uz = models.CharField("sarlavha (uz)", max_length=128)
    title_ru = models.CharField("sarlavha (ru)", max_length=128, blank=True)
    icon = models.CharField("ikona", max_length=32, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Mavzu"
        verbose_name_plural = "Mavzular"
        ordering = ["level", "order"]

    def __str__(self) -> str:
        return self.title_uz


class Lesson(BaseModel):
    theme = models.ForeignKey(
        Theme, on_delete=models.CASCADE, related_name="lessons", verbose_name="mavzu"
    )
    order = models.PositiveIntegerField("tartib", default=1)
    title_uz = models.CharField("sarlavha (uz)", max_length=128)
    title_ru = models.CharField("sarlavha (ru)", max_length=128, blank=True)
    min_age_band = models.CharField(
        "min yosh", max_length=8, choices=AgeBand.choices, default=AgeBand.Y3_4
    )

    class Meta(BaseModel.Meta):
        verbose_name = "Dars"
        verbose_name_plural = "Darslar"
        ordering = ["theme", "order"]

    def __str__(self) -> str:
        return f"{self.theme.title_uz} · {self.title_uz}"


class StepKind(models.TextChoices):
    INTRO = "intro", "Tanishtirish"
    PRACTICE = "practice", "Mashq"
    MASTERY = "mastery", "Tekshirish"


class LessonStep(BaseModel):
    lesson = models.ForeignKey(
        Lesson, on_delete=models.CASCADE, related_name="steps", verbose_name="dars"
    )
    order = models.PositiveIntegerField("tartib", default=1)
    kind = models.CharField("turi", max_length=12, choices=StepKind.choices)
    # Data-driven yelim: {"items": [word_id...], "game_types": ["eshit_va_bos", ...]}
    config_json = models.JSONField("konfiguratsiya", default=dict, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Dars qadami"
        verbose_name_plural = "Dars qadamlari"
        ordering = ["lesson", "order"]

    def __str__(self) -> str:
        return f"{self.lesson.title_uz} · {self.get_kind_display()}"


# ── Trek A: alifbo / fonetika ────────────────────────────────
class Letter(BaseModel):
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="letters", verbose_name="til"
    )
    char = models.CharField("harf", max_length=4)
    sound_ipa = models.CharField("tovush (IPA)", max_length=16, blank=True)
    audio = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    mnemonic_image = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    mnemonic_text = models.CharField("mnemonik", max_length=255, blank=True)
    group_no = models.PositiveIntegerField("guruh", default=1)  # §3 oson→qiyin guruhlar
    order = models.PositiveIntegerField("tartib", default=1)

    class Meta(BaseModel.Meta):
        verbose_name = "Harf"
        verbose_name_plural = "Harflar"
        ordering = ["language", "group_no", "order"]
        constraints = [
            models.UniqueConstraint(fields=["language", "char"], name="uniq_letter")
        ]

    def __str__(self) -> str:
        return self.char


# ── Trek B: so'z boyligi ─────────────────────────────────────
class Gender(models.TextChoices):
    MASC = "m", "Erkak (м)"
    FEM = "f", "Ayol (ж)"
    NEUT = "n", "Hech (ср)"
    NONE = "-", "—"  # sifat/fe'l uchun


class PartOfSpeech(models.TextChoices):
    NOUN = "noun", "Ot"
    VERB = "verb", "Fe'l"
    ADJ = "adj", "Sifat"
    OTHER = "other", "Boshqa"


class Word(BaseModel):
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="words", verbose_name="til"
    )
    lemma = models.CharField("so'z", max_length=64)
    translit = models.CharField("transliteratsiya", max_length=64, blank=True)
    # Urg'u tushadigan harf indeksi (rus tilida fonematik muhim: зáмок ≠ замóк)
    stress_index = models.IntegerField("urg'u indeksi", null=True, blank=True)
    # {"uz": "mushuk", ...} — qattiq o'zbekka bog'lanmaydi (B2B ko'p-L1)
    l1_translation_json = models.JSONField(
        "ona tili tarjimasi", default=dict, blank=True
    )
    image = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    audio_native = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    theme = models.ForeignKey(
        Theme,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="words",
        verbose_name="mavzu",
    )
    difficulty = models.PositiveIntegerField("qiyinlik", default=1)
    part_of_speech = models.CharField(
        "so'z turkumi",
        max_length=8,
        choices=PartOfSpeech.choices,
        default=PartOfSpeech.NOUN,
    )
    gender = models.CharField(
        "rod", max_length=2, choices=Gender.choices, default=Gender.NONE
    )
    plural_form = models.CharField("ko'plik", max_length=64, blank=True)
    freq_rank = models.PositiveIntegerField("chastota o'rni", null=True, blank=True)
    is_cognate_uz = models.BooleanField("o'zbekcha kognat", default=False)
    # §4.4 semantik interferensiya: o'xshash (tovush/shakl) so'zlar. Faza 5 dvigateli
    # bularni chalg'ituvchi (distractor) sifatida ishlatmaydi / yonma-yon qo'ymaydi.
    confusable_with = models.ManyToManyField(
        "self", symmetrical=True, blank=True, verbose_name="chalkashtiruvchi (o'xshash)"
    )

    class Meta(BaseModel.Meta):
        verbose_name = "So'z"
        verbose_name_plural = "So'zlar"
        ordering = ["theme", "freq_rank", "lemma"]
        constraints = [
            models.UniqueConstraint(fields=["language", "lemma"], name="uniq_word")
        ]

    def __str__(self) -> str:
        return self.lemma


class Phrase(BaseModel):
    language = models.ForeignKey(
        Language, on_delete=models.CASCADE, related_name="phrases", verbose_name="til"
    )
    text = models.CharField("matn", max_length=255)
    audio = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    l1_translation_json = models.JSONField(
        "ona tili tarjimasi", default=dict, blank=True
    )
    words = models.ManyToManyField(Word, blank=True, related_name="phrases")

    class Meta(BaseModel.Meta):
        verbose_name = "Ibora"
        verbose_name_plural = "Iboralar"

    def __str__(self) -> str:
        return self.text


# ── Kontekst: ertak va qo'shiq ───────────────────────────────
class Story(BaseModel):
    level = models.ForeignKey(
        Level, on_delete=models.CASCADE, related_name="stories", verbose_name="daraja"
    )
    title = models.CharField("sarlavha", max_length=128)

    class Meta(BaseModel.Meta):
        verbose_name = "Ertak"
        verbose_name_plural = "Ertaklar"

    def __str__(self) -> str:
        return self.title


class StoryNode(BaseModel):
    story = models.ForeignKey(
        Story, on_delete=models.CASCADE, related_name="nodes", verbose_name="ertak"
    )
    order = models.PositiveIntegerField("tartib", default=1)
    text = models.TextField("matn", blank=True)
    audio = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    image = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    # [{"label": "...", "next_node": "<uuid>"}, ...] — choose-your-path
    choices_json = models.JSONField("tanlovlar", default=list, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "Ertak sahnasi"
        verbose_name_plural = "Ertak sahnalari"
        ordering = ["story", "order"]

    def __str__(self) -> str:
        return f"{self.story.title} · #{self.order}"


class Song(BaseModel):
    theme = models.ForeignKey(
        Theme, on_delete=models.CASCADE, related_name="songs", verbose_name="mavzu"
    )
    title = models.CharField("sarlavha", max_length=128)
    audio = models.ForeignKey(
        Media, on_delete=models.SET_NULL, null=True, blank=True, related_name="+"
    )
    lyrics_json = models.JSONField("matn (lyrics)", default=list, blank=True)
    words = models.ManyToManyField(Word, blank=True, related_name="songs")

    class Meta(BaseModel.Meta):
        verbose_name = "Qo'shiq"
        verbose_name_plural = "Qo'shiqlar"

    def __str__(self) -> str:
        return self.title


# ── O'yin katalogi (data-driven dvigatel poydevori, §5) ──────
class SkillDimension(models.TextChoices):
    """SRS o'lchovi — qaysi strength haydaladi (§4.3). schedule(dimension) shuni o'qiydi."""

    RECEPTIVE = "receptive", "Reseptiv (tanib olish)"
    EXPRESSIVE = "expressive", "Ekspressiv (ishlab chiqarish)"


class GameType(BaseModel):
    key = models.SlugField("kalit", max_length=32, unique=True)
    name_uz = models.CharField("nom (uz)", max_length=64)
    name_ru = models.CharField("nom (ru)", max_length=64, blank=True)
    skill = models.CharField("ko'nikma", max_length=64, blank=True)  # erkin tavsif (slug)
    # SRS o'lchovi: reseptiv (tanib olish) / ekspressiv (ishlab chiqarish) — strength'ni ajratadi
    dimension = models.CharField(
        "o'lcham (SRS)",
        max_length=12,
        choices=SkillDimension.choices,
        default=SkillDimension.RECEPTIVE,
    )
    min_age_band = models.CharField(
        "min yosh", max_length=8, choices=AgeBand.choices, default=AgeBand.Y3_4
    )
    # Mexanika qanday config kutishini tavsiflaydi (Faza 5 o'yin dvigateli tayanadi)
    schema_json = models.JSONField("config sxemasi", default=dict, blank=True)

    class Meta(BaseModel.Meta):
        verbose_name = "O'yin turi"
        verbose_name_plural = "O'yin turlari"
        ordering = ["key"]

    def __str__(self) -> str:
        return f"{self.name_uz} ({self.key})"
