from django.contrib import admin

from .models import ChildProfile, ParentAccount


@admin.register(ParentAccount)
class ParentAccountAdmin(admin.ModelAdmin):
    list_display = [
        "__str__",
        "phone",
        "email",
        "full_name",
        "is_active",
        "is_staff",
        "created_at",
    ]
    list_filter = ["is_active", "is_staff"]
    search_fields = ["phone", "email", "full_name"]
    readonly_fields = ["created_at", "updated_at", "last_login", "password"]
    exclude = ["groups", "user_permissions"]


@admin.register(ChildProfile)
class ChildProfileAdmin(admin.ModelAdmin):
    list_display = [
        "display_name",
        "parent",
        "age_band",
        "avatar_id",
        "has_pin",
        "is_active",
        "created_at",
    ]
    list_filter = ["age_band", "is_active", "avatar_id"]
    # Ma'lumot minimallashtirish: ota-ona telefon/email bo'yicha qidiruv yo'q (PII).
    search_fields = ["display_name", "parent__full_name"]
    readonly_fields = ["created_at", "updated_at", "pin"]

    @admin.display(boolean=True, description="PIN bor")
    def has_pin(self, obj) -> bool:
        return obj.has_pin
