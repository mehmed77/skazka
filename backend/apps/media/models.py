"""media — audio/rasm/lottie aktivlari (SPEC §7.3, §10).

Skeleton: hozircha model yo'q. MinIO/S3 sozlamasi `config.settings` da tayyor;
bucket `init_storage` buyrug'i bilan yaratiladi.

Faza 3'da qo'shiladi: Media(kind[audio|image|lottie], storage_key, duration_ms,
meta_json) + Celery task (audio normalize/transcode, rasm resize/optimize).
"""
