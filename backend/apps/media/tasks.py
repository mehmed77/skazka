"""Media ishlov Celery tasklari (SPEC §9.2) — TOLERANT.

ffmpeg/Pillow yoki MinIO yo'q bo'lsa task fail bo'ladi, lekin tizim/boot to'xtamaydi
(faqat log). Faza 3: audio normalize/transcode + rasm optimize.
"""

import io
import logging
import os
import subprocess
import tempfile

from celery import shared_task
from django.core.files.base import ContentFile

logger = logging.getLogger(__name__)


@shared_task
def normalize_audio(media_id: str) -> dict:
    """Audio: duration_ms (mutagen) + mp3/ogg transcode (ffmpeg, loudnorm)."""
    from apps.media.models import Media

    m = Media.objects.filter(id=media_id, kind="audio").first()
    if not m or not m.file:
        return {"skipped": "media yo'q yoki faylsiz"}

    try:
        data = m.file.read()
    except Exception as exc:  # noqa: BLE001 — MinIO yo'q bo'lsa ham yiqilmaymiz
        logger.warning("normalize_audio: fayl o'qilmadi (%s): %s", media_id, exc)
        return {"error": "fayl o'qilmadi"}

    ext = os.path.splitext(m.file.name)[1] or ".bin"
    with tempfile.NamedTemporaryFile(suffix=ext, delete=False) as tf:
        tf.write(data)
        src = tf.name

    meta = dict(m.meta or {})
    renditions = {}
    try:
        # duration — mutagen (ffmpeg shart emas)
        try:
            from mutagen import File as MutagenFile

            mf = MutagenFile(src)
            if (
                mf is not None
                and getattr(mf, "info", None)
                and getattr(mf.info, "length", None)
            ):
                m.duration_ms = int(mf.info.length * 1000)
        except Exception as exc:  # noqa: BLE001
            logger.warning("normalize_audio: duration o'qilmadi: %s", exc)

        # transcode — ffmpeg (tolerant: ffmpeg yo'q bo'lsa skip)
        for fmt, codec in (("mp3", "libmp3lame"), ("ogg", "libvorbis")):
            out = f"{src}.{fmt}"
            try:
                subprocess.run(
                    ["ffmpeg", "-y", "-i", src, "-af", "loudnorm", "-c:a", codec, out],
                    check=True,
                    capture_output=True,
                    timeout=120,
                )
                with open(out, "rb") as fh:
                    key = m.file.storage.save(
                        f"content/audio/{m.id}.{fmt}", ContentFile(fh.read())
                    )
                renditions[fmt] = key
                os.remove(out)
            except FileNotFoundError:
                logger.warning("normalize_audio: ffmpeg topilmadi — transcode skip")
                break
            except Exception as exc:  # noqa: BLE001
                logger.warning("normalize_audio: %s transcode xato: %s", fmt, exc)

        if renditions:
            meta["renditions"] = renditions
        m.meta = meta
        m.save(update_fields=["duration_ms", "meta", "updated_at"])
        return {"duration_ms": m.duration_ms, "renditions": list(renditions)}
    finally:
        try:
            os.remove(src)
        except OSError:
            pass


@shared_task
def optimize_image(media_id: str) -> dict:
    """Rasm: o'lcham (meta) + thumbnail/full (WebP + PNG)."""
    from apps.media.models import Media

    m = Media.objects.filter(id=media_id, kind="image").first()
    if not m or not m.file:
        return {"skipped": "media yo'q yoki faylsiz"}
    try:
        data = m.file.read()
    except Exception as exc:  # noqa: BLE001
        logger.warning("optimize_image: fayl o'qilmadi (%s): %s", media_id, exc)
        return {"error": "fayl o'qilmadi"}

    try:
        from PIL import Image

        Image.MAX_IMAGE_PIXELS = 40_000_000  # decompression bomb chegarasi (DoS)
        img = Image.open(io.BytesIO(data))
        img.load()
        meta = dict(m.meta or {})
        meta["width"], meta["height"] = img.size
        renditions = {}
        for label, box in (("thumb", (128, 128)), ("full", (1024, 1024))):
            im = img.copy()
            im.thumbnail(box)
            for fmt in ("webp", "png"):
                buf = io.BytesIO()
                im.convert("RGBA" if fmt == "png" else "RGB").save(
                    buf, format=fmt.upper()
                )
                key = m.file.storage.save(
                    f"content/image/{m.id}_{label}.{fmt}", ContentFile(buf.getvalue())
                )
                renditions[f"{label}_{fmt}"] = key
        meta["renditions"] = renditions
        m.meta = meta
        m.save(update_fields=["meta", "updated_at"])
        return {"size": [meta["width"], meta["height"]], "renditions": list(renditions)}
    except (
        Exception
    ) as exc:  # noqa: BLE001 — Pillow/MinIO muammosi tizimni to'xtatmaydi
        logger.warning("optimize_image: xato (%s): %s", media_id, exc)
        return {"error": str(exc)}
