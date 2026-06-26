"""Kontent kesh versiyasi — admin save'da bump bo'ladi, eski kalitlar tabiiy eskiradi."""

from django.core.cache import cache

_KEY = "content:version"


def content_version() -> int:
    v = cache.get(_KEY)
    if v is None:
        cache.add(_KEY, 1)
        v = cache.get(_KEY) or 1
    return int(v)


def bump_content_version() -> None:
    try:
        cache.incr(_KEY)
    except ValueError:
        # kalit yo'q edi — yaratamiz
        cache.add(_KEY, 1)
        try:
            cache.incr(_KEY)
        except ValueError:
            pass
