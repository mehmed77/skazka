"""Development sozlamalari."""

from .base import *  # noqa: F401,F403
from .base import env

DEBUG = True
ALLOWED_HOSTS = ["*"]

# Dev'da email konsolga chiqadi
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

CORS_ALLOW_ALL_ORIGINS = True

_ = env  # env keyinroq kerak bo'lishi mumkin
