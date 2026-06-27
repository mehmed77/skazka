from django.contrib import admin

from .models import ItemState, LearningEvent


@admin.register(ItemState)
class ItemStateAdmin(admin.ModelAdmin):
    list_display = (
        "child",
        "item_type",
        "item_id",
        "due_at",
        "reps",
        "lapses",
        "receptive_strength",
        "last_result",
    )
    list_filter = ("item_type", "last_result")
    search_fields = ("child__display_name", "item_id")
    readonly_fields = ("created_at", "updated_at")


@admin.register(LearningEvent)
class LearningEventAdmin(admin.ModelAdmin):
    list_display = ("event_id", "child", "item_type", "item_id", "game_type", "is_correct", "ts")
    list_filter = ("item_type", "is_correct", "game_type")
    search_fields = ("event_id", "child__display_name", "item_id")
    readonly_fields = ("created_at", "updated_at")
