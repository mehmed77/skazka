from django.contrib import admin

from .models import (
    GameType,
    Language,
    Lesson,
    LessonStep,
    Letter,
    Level,
    Phrase,
    Song,
    Story,
    StoryNode,
    Theme,
    Word,
)


# ── Inline'lar (kurikulum daraxti) ───────────────────────────
class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 0
    fields = ["order", "title_uz", "title_ru", "min_age_band"]
    ordering = ["order"]


class LessonStepInline(admin.TabularInline):
    model = LessonStep
    extra = 0
    fields = ["order", "kind", "config_json"]
    ordering = ["order"]


class StoryNodeInline(admin.TabularInline):
    model = StoryNode
    extra = 0
    ordering = ["order"]


@admin.register(Language)
class LanguageAdmin(admin.ModelAdmin):
    list_display = ["code", "name"]
    search_fields = ["code", "name"]


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin):
    list_display = ["__str__", "language", "order"]
    list_filter = ["language"]
    ordering = ["language", "order"]


@admin.register(Theme)
class ThemeAdmin(admin.ModelAdmin):
    list_display = ["title_uz", "key", "level", "order"]
    list_filter = ["level"]
    search_fields = ["key", "title_uz", "title_ru"]
    ordering = ["level", "order"]
    inlines = [LessonInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ["title_uz", "theme", "order", "min_age_band"]
    list_filter = ["min_age_band", "theme"]
    ordering = ["theme", "order"]
    inlines = [LessonStepInline]


@admin.register(Letter)
class LetterAdmin(admin.ModelAdmin):
    list_display = ["char", "language", "group_no", "order", "sound_ipa"]
    list_filter = ["language", "group_no"]
    search_fields = ["char"]
    ordering = ["language", "group_no", "order"]


@admin.register(Word)
class WordAdmin(admin.ModelAdmin):
    list_display = [
        "lemma",
        "translit",
        "theme",
        "gender",
        "part_of_speech",
        "freq_rank",
        "is_cognate_uz",
    ]
    list_filter = ["is_cognate_uz", "gender", "part_of_speech", "theme", "language"]
    search_fields = ["lemma", "translit"]
    ordering = ["theme", "freq_rank", "lemma"]


@admin.register(Phrase)
class PhraseAdmin(admin.ModelAdmin):
    list_display = ["text", "language"]
    search_fields = ["text"]
    filter_horizontal = ["words"]


@admin.register(Story)
class StoryAdmin(admin.ModelAdmin):
    list_display = ["title", "level"]
    inlines = [StoryNodeInline]


@admin.register(Song)
class SongAdmin(admin.ModelAdmin):
    list_display = ["title", "theme"]
    filter_horizontal = ["words"]


@admin.register(GameType)
class GameTypeAdmin(admin.ModelAdmin):
    list_display = ["key", "name_uz", "skill", "min_age_band"]
    list_filter = ["min_age_band", "skill"]
    search_fields = ["key", "name_uz", "name_ru"]
