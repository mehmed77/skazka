"""content serializerlari — kurikulum daraxti va to'liq RESOLVE qilingan dars.

Faza 3: kontentni media URL'lari bilan to'liq yetkazib berish. Distractor TANLASH,
SRS navbati, o'yin renderi — bu fazada YO'Q (faqat ma'lumot).
"""

from rest_framework import serializers

from .models import (
    GameType,
    Lesson,
    LessonStep,
    Letter,
    Level,
    Song,
    Story,
    Theme,
    Word,
)

# Yosh diapazoni tartibi (3-4 < 5-6 < 6-7)
AGE_RANK = {"3-4": 0, "5-6": 1, "6-7": 2}


def _media_url(media):
    """Media (yoki None) → absolyut public URL yoki None."""
    if media and media.file:
        return media.file.url
    return None


# ── Resolve qilingan birliklar (lesson detalida) ─────────────
class ResolvedWordSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    confusable_ids = serializers.SerializerMethodField()

    class Meta:
        model = Word
        fields = [
            "id",
            "type",
            "lemma",
            "translit",
            "stress_index",
            "l1_translation_json",
            "gender",
            "part_of_speech",
            "image_url",
            "audio_url",
            "confusable_ids",
        ]

    def get_type(self, obj):
        return "word"

    def get_image_url(self, obj):
        return _media_url(obj.image)

    def get_audio_url(self, obj):
        return _media_url(obj.audio_native)

    def get_confusable_ids(self, obj):
        # §4.4 — frontend'ga ma'lumot (distractor TANLASH logikasi Faza 5'da)
        return [str(w.id) for w in obj.confusable_with.all()]


class ResolvedLetterSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    audio_url = serializers.SerializerMethodField()
    mnemonic_image_url = serializers.SerializerMethodField()
    confusable_ids = (
        serializers.SerializerMethodField()
    )  # harfda hozir yo'q → [] (uniform kontrakt)

    class Meta:
        model = Letter
        fields = [
            "id",
            "type",
            "char",
            "sound_ipa",
            "mnemonic_text",
            "audio_url",
            "mnemonic_image_url",
            "group_no",
            "confusable_ids",
        ]

    def get_type(self, obj):
        return "letter"

    def get_confusable_ids(self, obj):
        return (
            []
        )  # Letter modelida confusable_with M2M yo'q (Faza 7); uniform kontrakt uchun []

    def get_audio_url(self, obj):
        return _media_url(obj.audio)

    def get_mnemonic_image_url(self, obj):
        return _media_url(obj.mnemonic_image)


# ── Faza 9: ertak (choose-path, chiziqli) + qo'shiq (lyrics + highlight) ──
class ResolvedStoryNodeSerializer(serializers.Serializer):
    """Ertak sahnasi — narration (text/audio) + visual + comprehension nishoni (prompt_word).

    choices_json konvensiyasi: comprehension gate → {"prompt_word_id": "<uuid>"} (frontend
    buildOptions bilan §4.4 distraktor quradi). Narration sahnasi → bo'sh. Tarmoq (next_node)
    struktura kelajak uchun qoldirilgan; 1-ertak CHIZIQLI (order bo'yicha).
    """

    order = serializers.IntegerField()
    text = serializers.CharField()
    audio_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    prompt_word = serializers.SerializerMethodField()

    def get_audio_url(self, obj):
        return _media_url(obj.audio)

    def get_image_url(self, obj):
        return _media_url(obj.image)

    def get_prompt_word(self, obj):
        cfg = obj.choices_json if isinstance(obj.choices_json, dict) else {}
        wid = cfg.get("prompt_word_id")
        if not wid:
            return None
        w = Word.objects.filter(id=wid).first()
        return ResolvedWordSerializer(w, context=self.context).data if w else None


class ResolvedStorySerializer(serializers.ModelSerializer):
    nodes = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = ["id", "title", "nodes"]

    def get_nodes(self, obj):
        nodes = obj.nodes.all().order_by("order")
        return ResolvedStoryNodeSerializer(nodes, many=True, context=self.context).data


class ResolvedSongSerializer(serializers.ModelSerializer):
    audio_url = serializers.SerializerMethodField()
    words = serializers.SerializerMethodField()

    class Meta:
        model = Song
        fields = ["id", "title", "audio_url", "lyrics_json", "words"]

    def get_audio_url(self, obj):
        return _media_url(
            obj.audio
        )  # null → frontend TTS placeholder (real qo'shiq audiosi keyin)

    def get_words(self, obj):
        return ResolvedWordSerializer(
            obj.words.all(), many=True, context=self.context
        ).data


# ── Lesson detali (config_json RESOLVE) ──────────────────────
class LessonStepSerializer(serializers.ModelSerializer):
    new_items = serializers.SerializerMethodField()
    games = serializers.SerializerMethodField()

    class Meta:
        model = LessonStep
        fields = ["id", "order", "kind", "new_items", "games"]

    def get_new_items(self, obj):
        out = []
        for it in obj.config_json.get("new_items", []):
            t, _id = it.get("type"), it.get("id")
            if t == "word":
                w = Word.objects.filter(id=_id).first()
                if w:
                    out.append(ResolvedWordSerializer(w, context=self.context).data)
            elif t == "letter":
                ltr = Letter.objects.filter(id=_id).first()
                if ltr:
                    out.append(ResolvedLetterSerializer(ltr, context=self.context).data)
        return out

    def get_games(self, obj):
        gt_map = {g.key: g for g in GameType.objects.all()}
        out = []
        for g in obj.config_json.get("games", []):
            gt = gt_map.get(g.get("type"))
            item = {
                **g,  # config'dagi parametrlar (distractors, pair_mode, story_id, song_id, ...)
                "name_uz": gt.name_uz if gt else None,
                "name_ru": gt.name_ru if gt else None,
                "min_age_band": gt.min_age_band if gt else None,
                "schema": gt.schema_json if gt else {},
            }
            # Faza 9: ertak/qo'shiq kontent konteynerini RESOLVE qilish (item emas — spec'da)
            if g.get("story_id"):
                story = Story.objects.filter(id=g["story_id"]).first()
                item["story"] = (
                    ResolvedStorySerializer(story, context=self.context).data
                    if story
                    else None
                )
            if g.get("song_id"):
                song = Song.objects.filter(id=g["song_id"]).first()
                item["song"] = (
                    ResolvedSongSerializer(song, context=self.context).data
                    if song
                    else None
                )
            out.append(item)
        return out


class LessonThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ["id", "key", "title_uz", "title_ru", "icon"]


class LessonDetailSerializer(serializers.ModelSerializer):
    theme = LessonThemeSerializer(read_only=True)
    steps = LessonStepSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "order",
            "title_uz",
            "title_ru",
            "min_age_band",
            "theme",
            "steps",
        ]


# ── Kurikulum daraxti (age_band filtri) ──────────────────────
class CurriculumLessonSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()
    kind = serializers.SerializerMethodField()  # Faza 9: dars-tanlovchi ikonasi uchun

    class Meta:
        model = Lesson
        fields = [
            "id",
            "order",
            "title_uz",
            "title_ru",
            "min_age_band",
            "progress",
            "kind",
        ]

    def get_progress(self, obj):
        # Faza 6 (SRS/rivoj) to'ldiradi. Hozir stub — struktura tayyor.
        return {"status": "available"}

    def get_kind(self, obj):
        """Dars turi (mexanikalaridan) — frontend dars-tanlovchida ikona ko'rsatadi."""
        types = set()
        for step in obj.steps.all():
            for g in (step.config_json or {}).get("games", []):
                if g.get("type"):
                    types.add(g["type"])
        if "sehrli_ertak" in types:
            return "story"
        if "qoshiq" in types:
            return "song"
        if "soz_qur" in types:
            return "word_build"
        if types & {"harf_ovi", "qaysi_tovush", "harf_chiz"}:
            return "letter"
        return "word"


class CurriculumThemeSerializer(serializers.ModelSerializer):
    lessons = serializers.SerializerMethodField()

    class Meta:
        model = Theme
        fields = ["id", "order", "key", "title_uz", "title_ru", "icon", "lessons"]

    def get_lessons(self, obj):
        rank = self.context.get("age_rank", 0)
        visible = [
            ls for ls in obj.lessons.all() if AGE_RANK.get(ls.min_age_band, 0) <= rank
        ]
        return CurriculumLessonSerializer(visible, many=True, context=self.context).data


class CurriculumLevelSerializer(serializers.ModelSerializer):
    themes = CurriculumThemeSerializer(many=True, read_only=True)

    class Meta:
        model = Level
        fields = ["id", "order", "title_uz", "title_ru", "themes"]
