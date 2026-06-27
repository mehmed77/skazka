"""
SKAZKA — umumiy (base) sozlamalar.
Dev/prod sozlamalari shu fayldan meros oladi.
"""

from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent

env = environ.Env(
    DJANGO_DEBUG=(bool, False),
)

# ── Asosiy ───────────────────────────────────────
SECRET_KEY = env("DJANGO_SECRET_KEY", default="insecure-dev-key")
DEBUG = env("DJANGO_DEBUG")
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])

# ── Ilovalar ─────────────────────────────────────
DJANGO_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
]

THIRD_PARTY_APPS = [
    "rest_framework",
    "rest_framework_simplejwt",
    "django_filters",
    "drf_spectacular",
    "corsheaders",
    "django_celery_beat",
    "rest_framework_simplejwt.token_blacklist",
]

# SKAZKA bounded-context'lari (SPEC §9.2). Hozircha skeleton — modellar keyingi fazalarda.
LOCAL_APPS = [
    "apps.common",
    "apps.accounts",
    "apps.content",
    "apps.learning",
    "apps.gamification",
    "apps.media",
    "apps.billing",
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ── Ma'lumotlar bazasi ───────────────────────────
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": env("POSTGRES_DB", default="skazka"),
        "USER": env("POSTGRES_USER", default="skazka"),
        "PASSWORD": env("POSTGRES_PASSWORD", default="skazka"),
        "HOST": env("POSTGRES_HOST", default="db"),
        "PORT": env("POSTGRES_PORT", default="5432"),
    }
}

# ── Auth ─────────────────────────────────────────
# Ota-ona akkaunti = custom user (telefon/email + parol). Bolada login YO'Q (SPEC §8).
AUTH_USER_MODEL = "accounts.ParentAccount"

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
]

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ── Til / vaqt ───────────────────────────────────
LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# ── Static / media ───────────────────────────────
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ── DRF ──────────────────────────────────────────
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticated",),
    "DEFAULT_FILTER_BACKENDS": (
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ),
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.DefaultPagination",
    "PAGE_SIZE": 200,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_THROTTLE_CLASSES": ("rest_framework.throttling.ScopedRateThrottle",),
    "DEFAULT_THROTTLE_RATES": {
        "login": "10/min",
        "register": "30/hour",
        "profiles": "120/hour",
        "pin_entry": "5/min",  # PIN brute-force himoyasi (enter)
        "content": "240/min",  # curriculum/lesson o'qish (saxiy — har dars yuklashda)
        "learning": "600/min",  # SRS event (har javob) + sessiya navbati — o'yin davomida tez-tez
    },
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
}

SPECTACULAR_SETTINGS = {
    "TITLE": "SKAZKA API",
    "DESCRIPTION": "Bolalar uchun rus tili o'rgatuvchi platforma — API",
    "VERSION": "0.1.0",
    "SERVE_INCLUDE_SCHEMA": False,
}

# ── CORS ─────────────────────────────────────────
CORS_ALLOWED_ORIGINS = env.list(
    "CORS_ALLOWED_ORIGINS", default=["http://localhost:3000"]
)

# ── Celery ───────────────────────────────────────
CELERY_BROKER_URL = env("REDIS_URL", default="redis://redis:6379/0")
CELERY_RESULT_BACKEND = env("REDIS_URL", default="redis://redis:6379/0")
CELERY_TIMEZONE = TIME_ZONE
CELERY_TASK_TRACK_STARTED = True

# Rejalashtirilgan vazifalar — hozircha bo'sh (Faza 6: SRS qayta hisob, Faza 8: hisobot).
CELERY_BEAT_SCHEDULE: dict = {}

# ── Cache ────────────────────────────────────────
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": env("REDIS_URL", default="redis://redis:6379/1"),
    }
}

# ── Fayl saqlash (MinIO / S3) — audio/rasm media ──
AWS_ACCESS_KEY_ID = env("MINIO_ROOT_USER", default="minioadmin")
AWS_SECRET_ACCESS_KEY = env("MINIO_ROOT_PASSWORD", default="minioadmin")
AWS_STORAGE_BUCKET_NAME = env("MINIO_BUCKET", default="skazka-media")
AWS_S3_ENDPOINT_URL = env("MINIO_ENDPOINT", default="http://minio:9000")
AWS_S3_REGION_NAME = env("MINIO_REGION", default="us-east-1")
AWS_DEFAULT_ACL = None
# Bolalar o'quv kontenti media'si PUBLIC (ADR — download-proxy QURILMADI): signed query yo'q,
# brauzer uchun public domen (dev: localhost:9000/<bucket>; prod: CDN — env orqali).
AWS_QUERYSTRING_AUTH = False
AWS_S3_CUSTOM_DOMAIN = env("MINIO_PUBLIC_DOMAIN", default="localhost:9000/skazka-media")
AWS_S3_URL_PROTOCOL = env("MINIO_URL_PROTOCOL", default="http:")
AWS_S3_FILE_OVERWRITE = False  # storage_key UUID — dublikat ustiga yozmaydi

STORAGES = {
    "default": {"BACKEND": "storages.backends.s3.S3Storage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

# ── Email ────────────────────────────────────────
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL", default="SKAZKA <no-reply@example.uz>")
