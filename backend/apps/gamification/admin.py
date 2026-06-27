from django.contrib import admin

from .models import (
    Achievement,
    ChildAchievement,
    ChildForestElement,
    ChildMishkaItem,
    ForestElement,
    MishkaItem,
    StreakRecord,
)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ("key", "title_uz", "category", "icon", "order")
    list_filter = ("category",)


@admin.register(ForestElement)
class ForestElementAdmin(admin.ModelAdmin):
    list_display = ("key", "title_uz", "asset_slot", "order")


@admin.register(MishkaItem)
class MishkaItemAdmin(admin.ModelAdmin):
    list_display = ("key", "title_uz", "slot", "asset_slot", "order")


@admin.register(StreakRecord)
class StreakRecordAdmin(admin.ModelAdmin):
    list_display = ("child", "current", "longest", "last_active_date")


for _m in (ChildAchievement, ChildForestElement, ChildMishkaItem):
    admin.site.register(_m)
