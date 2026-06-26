"""media — task tolerantligi va rasm optimize testlari."""

import io

import pytest
from django.core.files.base import ContentFile
from django.test import override_settings

from apps.media.models import Media, MediaKind
from apps.media.tasks import normalize_audio, optimize_image

# Test'da lokal fayl tizimi (MinIO'siz) — task mantig'ini izolyatsiya qiladi
LOCAL_STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}


def test_media_file_validation():
    from django.core.exceptions import ValidationError

    from apps.media.models import validate_media_file

    class _Sized:  # hajm testi uchun (PIL'gacha yetib bormaydi)
        def __init__(self, name, size):
            self.name = name
            self.size = size

    # 1) .svg kengaytma → rad (allowlist)
    with pytest.raises(ValidationError):
        validate_media_file(_Sized("evil.svg", 100))
    # 2) juda katta → rad (DoS)
    with pytest.raises(ValidationError):
        validate_media_file(_Sized("big.png", 30 * 1024 * 1024))
    # 3) MIME confusion: SVG (skript) .png nomi bilan → KONTENT tekshiruvi rad etadi
    svg_as_png = ContentFile(
        b'<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>',
        name="evil.png",
    )
    with pytest.raises(ValidationError):
        validate_media_file(svg_as_png)
    # 4) haqiqiy PNG → o'tadi
    buf = io.BytesIO()
    from PIL import Image

    Image.new("RGB", (10, 10), "red").save(buf, format="PNG")
    validate_media_file(ContentFile(buf.getvalue(), name="ok.png"))


@pytest.mark.django_db
def test_normalize_audio_tolerant_without_file():
    m = Media.objects.create(kind=MediaKind.AUDIO, title="faylsiz")
    res = normalize_audio(str(m.id))  # fayl yo'q → xato emas, skip
    assert "skipped" in res


@override_settings(STORAGES=LOCAL_STORAGES)
@pytest.mark.django_db
def test_optimize_image_writes_meta_and_renditions():
    buf = io.BytesIO()
    try:
        from PIL import Image
    except ImportError:
        pytest.skip("Pillow yo'q")
    Image.new("RGB", (300, 200), "red").save(buf, format="PNG")

    m = Media.objects.create(kind=MediaKind.IMAGE, title="rasm")
    m.file.save("t.png", ContentFile(buf.getvalue()), save=True)
    optimize_image(str(m.id))

    m.refresh_from_db()
    assert m.meta.get("width") == 300
    assert m.meta.get("height") == 200
    assert "renditions" in m.meta  # thumb/full webp+png
