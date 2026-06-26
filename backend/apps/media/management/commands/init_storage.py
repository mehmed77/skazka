"""MinIO/S3 bucket'ini yaratadi (idempotent, tolerant).

Backend ishga tushganda chaqiriladi. MinIO mavjud bo'lmasa ham boot to'xtamasin —
xato faqat ogohlantirish sifatida chiqadi (skeleton fazasida media yuklanmaydi).
"""

from django.conf import settings
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "MinIO/S3 bucket'ini yaratadi (yo'q bo'lsa)."

    def handle(self, *args, **options):
        bucket = settings.AWS_STORAGE_BUCKET_NAME
        endpoint = settings.AWS_S3_ENDPOINT_URL
        try:
            import boto3
            from botocore.client import Config

            s3 = boto3.client(
                "s3",
                endpoint_url=endpoint,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                region_name=settings.AWS_S3_REGION_NAME,
                config=Config(signature_version="s3v4"),
            )
            existing = [b["Name"] for b in s3.list_buckets().get("Buckets", [])]
            if bucket in existing:
                self.stdout.write(f"[init_storage] '{bucket}' allaqachon mavjud")
            else:
                s3.create_bucket(Bucket=bucket)
                self.stdout.write(
                    self.style.SUCCESS(f"[init_storage] '{bucket}' yaratildi")
                )
            # Bolalar o'quv kontenti — PUBLIC-READ (download-proxy yo'q, ADR). Anonim GetObject.
            import json

            policy = {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": {"AWS": ["*"]},
                        "Action": ["s3:GetObject"],
                        "Resource": [f"arn:aws:s3:::{bucket}/*"],
                    }
                ],
            }
            s3.put_bucket_policy(Bucket=bucket, Policy=json.dumps(policy))
            self.stdout.write(
                f"[init_storage] '{bucket}' public-read policy o'rnatildi"
            )
        except Exception as exc:  # noqa: BLE001 — boot'ni to'xtatmaymiz
            self.stdout.write(
                self.style.WARNING(
                    f"[init_storage] bucket yaratilmadi ({endpoint}): {exc} — sakrab o'tildi"
                )
            )
