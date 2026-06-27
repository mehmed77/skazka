from rest_framework import serializers

from .models import ItemType


class EventInputSerializer(serializers.Serializer):
    """POST /learning/event/ kirishi — client-generated event_id (idempotentlik)."""

    event_id = serializers.UUIDField()
    item_type = serializers.ChoiceField(choices=ItemType.choices)
    item_id = serializers.UUIDField()
    game_type = serializers.CharField(max_length=32, required=False, allow_blank=True, default="")
    is_correct = serializers.BooleanField(required=False, default=False)
    latency_ms = serializers.IntegerField(
        required=False, allow_null=True, min_value=0, default=None
    )
    hint_used = serializers.BooleanField(required=False, default=False)
    session_id = serializers.CharField(
        max_length=64, required=False, allow_blank=True, allow_null=True, default=""
    )
    ts = serializers.DateTimeField(required=False, allow_null=True, default=None)
