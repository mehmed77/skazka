"""Kontent o'zgarsa kesh versiyasini bump qiladi (curriculum/lesson keshi invalidatsiya)."""

from django.db.models.signals import post_delete, post_save

from apps.media.models import Media

from .cache import bump_content_version
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

_MODELS = [
    Language,
    Level,
    Theme,
    Lesson,
    LessonStep,
    Letter,
    Word,
    Phrase,
    Story,
    StoryNode,
    Song,
    GameType,
    Media,
]


def _bump(sender, **kwargs):
    bump_content_version()


def connect():
    for model in _MODELS:
        label = model._meta.label
        post_save.connect(
            _bump, sender=model, dispatch_uid=f"content_bump_save_{label}"
        )
        post_delete.connect(
            _bump, sender=model, dispatch_uid=f"content_bump_del_{label}"
        )
