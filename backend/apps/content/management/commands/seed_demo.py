"""Demo kontent seed'i — placeholder (Faza 2'da to'ldiriladi).

Faza 2'da: ru tili + Level 1, 1-harf guruhi (А,О,К,М,Т,С,Н,И),
2 mavzu ("Hayvonlar (uy)", "Ranglar"), GameType katalogi (§5 — 11 mexanika).
Hozircha idempotent no-op — `make seed` va release.sh'da xavfsiz chaqiriladi.
"""

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Demo kurikulum kontentini yaratadi (Faza 2 placeholder)."

    def handle(self, *args, **options):
        self.stdout.write(
            "[seed_demo] kontent modellari hali yo'q (skeleton). "
            "Faza 2'da demo darslar shu yerda yaratiladi."
        )
