from django.contrib import admin
from django.utils.html import format_html

from .models import Media


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ["__str__", "kind", "preview", "duration_ms", "created_at"]
    list_filter = ["kind"]
    search_fields = ["title"]
    readonly_fields = ["preview", "created_at", "updated_at"]

    @admin.display(description="Ko'rinish")
    def preview(self, obj):
        if not obj.file:
            return "—"
        if obj.kind == "image":
            return format_html(
                '<img src="{}" style="max-height:80px;border-radius:8px"/>',
                obj.file.url,
            )
        if obj.kind == "audio":
            return format_html('<audio controls src="{}"></audio>', obj.file.url)
        return obj.file.name
