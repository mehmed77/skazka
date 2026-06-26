"""content serializerlari — kurikulum daraxti va to'liq RESOLVE qilingan dars.

Faza 3: kontentni media URL'lari bilan to'liq yetkazib berish. Distractor TANLASH,
SRS navbati, o'yin renderi — bu fazada YO'Q (faqat ma'lumot).
"""

from rest_framework import serializers

from .models import GameType, Lesson, LessonStep, Letter, Level, Theme, Word

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
        ]

    def get_type(self, obj):
        return "letter"

    def get_audio_url(self, obj):
        return _media_url(obj.audio)

    def get_mnemonic_image_url(self, obj):
        return _media_url(obj.mnemonic_image)


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
            out.append(
                {
                    **g,  # config'dagi parametrlar (distractors, pair_mode, ...)
                    "name_uz": gt.name_uz if gt else None,
                    "name_ru": gt.name_ru if gt else None,
                    "min_age_band": gt.min_age_band if gt else None,
                    "schema": gt.schema_json if gt else {},
                }
            )
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

    class Meta:
        model = Lesson
        fields = ["id", "order", "title_uz", "title_ru", "min_age_band", "progress"]

    def get_progress(self, obj):
        # Faza 6 (SRS/rivoj) to'ldiradi. Hozir stub — struktura tayyor.
        return {"status": "available"}


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
