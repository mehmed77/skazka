"""Development sozlamalari."""

from .base import *  # noqa: F401,F403
from .base import REST_FRAMEWORK, env

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Dev'da rate-limit SAXIY — e2e (Playwright har testda register qiladi) va qo'lda test
# trafigini bo'g'masin. Throttle MEXANIZMI qoladi (faqat rate yuqori). Prod base'da QATTIQ
# (register 30/hour) — bu override faqat dev.py'da.
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_THROTTLE_RATES": {
        **REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"],
        "login": "2000/min",
        "register": "2000/hour",
        "profiles": "6000/hour",
        "pin_entry": "1000/min",
        "content": "6000/min",
    },
}

# Dev'da email konsolga chiqadi
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CORS_ALLOW_ALL_ORIGINS = True

# Admin/form POST'lari nginx (8080) orqali keladi — Django 4+ Origin'ni shu ro'yxatdan qidiradi.
CSRF_TRUSTED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
]

_ = env  # env keyinroq kerak bo'lishi mumkin
