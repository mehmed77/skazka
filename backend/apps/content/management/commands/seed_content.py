"""Demo kurikulum seed'i (SPEC §3) — IDEMPOTENT (get_or_create, dublikat yo'q).

Yaratadi: ru+uz tillar, Level 1, 1-harf guruhi (А,О,К,М,Т,С,Н,И), GameType katalogi
(11 mexanika), 2 mavzu (Hayvonlar uy / Ranglar) so'zlari bilan, har mavzuda 1 ta dars
(intro→practice→mastery). Media biriktirilmaydi (real jonli ovoz/rasm — alohida vazifa).
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from apps.content.models import (
    GameType,
    Language,
    Lesson,
    LessonStep,
    Letter,
    Level,
    StepKind,
    Theme,
    Word,
)

# (lemma, translit, stress_index, uz, gender, plural, freq_rank, is_cognate_uz)
ANIMALS = [
    ("кошка", "koshka", 1, "mushuk", "f", "кошки", 1, False),
    ("собака", "sobaka", 3, "it", "f", "собаки", 2, False),
    ("корова", "korova", 3, "sigir", "f", "коровы", 3, False),
    ("лошадь", "loshad", 1, "ot", "f", "лошади", 4, False),
    ("коза", "koza", 3, "echki", "f", "козы", 5, False),
    ("свинья", "svinya", 5, "cho'chqa", "f", "свиньи", 6, False),
]
COLORS = [
    ("красный", "krasniy", 2, "qizil", "-", "красные", 1, False),
    ("синий", "siniy", 1, "ko'k", "-", "синие", 2, False),
    ("зелёный", "zelyoniy", 3, "yashil", "-", "зелёные", 3, False),
    ("жёлтый", "jyoltiy", 1, "sariq", "-", "жёлтые", 4, False),
    ("белый", "beliy", 1, "oq", "-", "белые", 5, False),
    ("чёрный", "chyorniy", 1, "qora", "-", "чёрные", 6, False),
]
# (char, sound_ipa, mnemonic) — 1-guruh (§3: tanish ko'rinish/tovush)
LETTERS = [
    ("А", "a", "Aist (laylak) — 'А'"),
    ("О", "o", "Olma — dumaloq 'О'"),
    ("К", "k", "Kot (mushuk) — 'К'"),
    ("М", "m", "Mama (ona) — 'М'"),
    ("Т", "t", "Tigr (yo'lbars) — 'Т'"),
    ("С", "s", "Sok (sharbat) — 'С'"),
    ("Н", "n", "Nos (burun) — 'Н'"),
    ("И", "i", "Igla (igna) — 'И'"),
]
# (key, uz, ru, skill, min_age, schema_json) — §5 jadvalidagi 11 mexanika
GAME_TYPES = [
    (
        "eshit_va_bos",
        "Eshit va bos",
        "Слушай и нажми",
        "word_recognition",
        "3-4",
        {
            "prompt": "audio",
            "options": "image",
            "option_count": [2, 4],
            "answer": "single",
        },
    ),
    (
        "juftla",
        "Juftla",
        "Найди пару",
        "memory",
        "3-4",
        {"pairs": "image-audio|image-image", "grid": [4, 6]},
    ),
    (
        "topib_ber",
        "Topib ber",
        "Покажи…",
        "tpr",
        "3-4",
        {"scene": "objects", "prompt": "audio", "answer": "tap_object"},
    ),
    (
        "harf_ovi",
        "Harf ovi",
        "Где буква?",
        "letter_recognition",
        "5-6",
        {"target": "letter", "field": "letters_or_word"},
    ),
    (
        "harf_chiz",
        "Harf chiz",
        "Обведи букву",
        "tracing",
        "5-6",
        {"trace": "letter_path", "guide": True},
    ),
    (
        "qaysi_tovush",
        "Qaysi tovush?",
        "Какой звук?",
        "phonics",
        "5-6",
        {"prompt": "audio_sound", "options": "letters"},
    ),
    (
        "soz_qur",
        "So'z qur",
        "Собери слово",
        "word_building",
        "6-7",
        {"build": "syllables_or_letters", "target": "word"},
    ),
    (
        "sehrli_ertak",
        "Sehrli ertak",
        "Сказка",
        "story",
        "5-6",
        {"mode": "choose_path", "source": "story"},
    ),
    (
        "qoshiq",
        "Qo'shiq",
        "Песенка",
        "song",
        "3-4",
        {"audio": "song", "highlight": "words"},
    ),
    (
        "aytib_ber",
        "Aytib ber",
        "Скажи!",
        "speaking_asr",
        "5-6",
        {"prompt": "image", "capture": "speech", "phase": "later"},
    ),
    (
        "takrorlash",
        "Takrorlash o'yini",
        "Повторюшка",
        "mixed_retrieval",
        "3-4",
        {"mix": "due_words", "mechanic": "varied"},
    ),
]

# Mexanika → SRS o'lchovi (Faza 7). reseptiv=tanib olish, ekspressiv=ishlab chiqarish.
DIMENSIONS = {
    "eshit_va_bos": "receptive",
    "juftla": "receptive",
    "topib_ber": "receptive",
    "harf_ovi": "receptive",
    "qaysi_tovush": "receptive",
    "harf_chiz": "expressive",
    "soz_qur": "expressive",
    "sehrli_ertak": "receptive",
    "qoshiq": "receptive",
    "aytib_ber": "expressive",
    "takrorlash": "receptive",
}

# Kirill harf → tovush (IPA-soda). Dinamik harf seed (mavzu so'zlari harflari) uchun.
RU_SOUNDS = {
    "а": "a",
    "б": "b",
    "в": "v",
    "г": "g",
    "д": "d",
    "е": "je",
    "ё": "jo",
    "ж": "zh",
    "з": "z",
    "и": "i",
    "й": "j",
    "к": "k",
    "л": "l",
    "м": "m",
    "н": "n",
    "о": "o",
    "п": "p",
    "р": "r",
    "с": "s",
    "т": "t",
    "у": "u",
    "ф": "f",
    "х": "x",
    "ц": "ts",
    "ч": "ch",
    "ш": "sh",
    "щ": "shch",
    "ъ": "",
    "ы": "y",
    "ь": "",
    "э": "e",
    "ю": "ju",
    "я": "ja",
}

# So'z qurish (soz_qur) uchun qisqa so'zlar — FAQAT 1-guruh harflaridan (к,о,т,с,н,и,м,а,т)
SHORT_WORDS = [
    ("кот", "kot", 1, "mushuk (erkak)"),
    ("сон", "son", 1, "uyqu / tush"),
    ("нос", "nos", 1, "burun"),
]


class Command(BaseCommand):
    help = "Demo kurikulum kontentini yaratadi (idempotent)."

    @transaction.atomic
    def handle(self, *args, **options):
        ru, _ = Language.objects.get_or_create(code="ru", defaults={"name": "Rus tili"})
        Language.objects.get_or_create(code="uz", defaults={"name": "O'zbek tili"})

        level, _ = Level.objects.get_or_create(
            language=ru,
            order=1,
            defaults={"title_uz": "1-daraja", "title_ru": "Уровень 1"},
        )

        # Harflar (1-guruh)
        for i, (char, ipa, mnem) in enumerate(LETTERS, start=1):
            Letter.objects.get_or_create(
                language=ru,
                char=char,
                defaults={
                    "sound_ipa": ipa,
                    "mnemonic_text": mnem,
                    "group_no": 1,
                    "order": i,
                },
            )

        # GameType katalogi (+ dimension — idempotent, mavjud qatorga ham qo'llanadi)
        for key, uz, ru_name, skill, age, schema in GAME_TYPES:
            gt, _ = GameType.objects.get_or_create(
                key=key,
                defaults={
                    "name_uz": uz,
                    "name_ru": ru_name,
                    "skill": skill,
                    "min_age_band": age,
                    "schema_json": schema,
                },
            )
            dim = DIMENSIONS.get(key, "receptive")
            if gt.dimension != dim:
                gt.dimension = dim
                gt.save(update_fields=["dimension"])

        # Mavzular + so'zlar + darslar
        self._seed_theme(
            level,
            1,
            "animals_home",
            "Hayvonlar (uy)",
            "Животные (дом)",
            "🐾",
            "noun",
            ANIMALS,
            ["eshit_va_bos", "juftla", "topib_ber"],
        )
        self._seed_theme(
            level,
            2,
            "colors",
            "Ranglar",
            "Цвета",
            "🎨",
            "adj",
            COLORS,
            ["eshit_va_bos", "juftla"],
        )

        # §4.4 demo: o'xshash (confusable) juft — кошка ↔ коза ("ко" boshlanishi, 2 bo'g'in,
        # ayol jinsi). Faza 5 dvigateli bularni chalg'ituvchi qilmaydi / yonma-yon qo'ymaydi.
        try:
            koshka = Word.objects.get(language=ru, lemma="кошка")
            koza = Word.objects.get(language=ru, lemma="коза")
            koshka.confusable_with.add(koza)  # symmetrical → ikki tomon ham
        except Word.DoesNotExist:
            pass

        # ── Faza 7: harflar + alifbo darslari ──
        # Qisqa so'zlar (so'z qurish uchun — FAQAT 1-guruh harflaridan)
        for lemma, translit, freq, uz in SHORT_WORDS:
            Word.objects.get_or_create(
                language=ru,
                lemma=lemma,
                defaults={
                    "translit": translit,
                    "freq_rank": freq,
                    "l1_translation_json": {"uz": uz},
                    "part_of_speech": "noun",
                },
            )
        # Mavzu so'zlaridagi BARCHA kirill harflarni Letter sifatida (so'z_qur/takrorlash uchun).
        # Murakkab harflar (ж,ц,ч,ш,щ,ы,ъ,ь) faqat RECORD — alohida drill YO'Q (§3, keyin).
        existing = set(
            Letter.objects.filter(language=ru).values_list("char", flat=True)
        )
        next_order = Letter.objects.filter(language=ru).count()
        for w in Word.objects.filter(language=ru):
            for ch in w.lemma.upper():
                if ch in existing or not ch.isalpha():
                    continue
                next_order += 1
                Letter.objects.get_or_create(
                    language=ru,
                    char=ch,
                    defaults={
                        "sound_ipa": RU_SOUNDS.get(ch.lower(), ""),
                        "group_no": 2,
                        "order": next_order,
                    },
                )
                existing.add(ch)
        # Alifbo mavzusi + darslari (harf mexanikalari + so'z qurish)
        self._seed_alphabet(level, ru)

        counts = {
            "languages": Language.objects.count(),
            "letters": Letter.objects.count(),
            "game_types": GameType.objects.count(),
            "themes": Theme.objects.count(),
            "words": Word.objects.count(),
            "lessons": Lesson.objects.count(),
            "steps": LessonStep.objects.count(),
        }
        self.stdout.write(self.style.SUCCESS(f"[seed_content] tayyor: {counts}"))

    def _seed_theme(
        self, level, order, key, title_uz, title_ru, icon, pos, rows, game_keys
    ):
        ru = level.language
        theme, _ = Theme.objects.get_or_create(
            level=level,
            key=key,
            defaults={
                "order": order,
                "title_uz": title_uz,
                "title_ru": title_ru,
                "icon": icon,
            },
        )
        words = []
        for lemma, translit, stress, uz, gender, plural, freq, cognate in rows:
            word, _ = Word.objects.get_or_create(
                language=ru,
                lemma=lemma,
                defaults={
                    "translit": translit,
                    "stress_index": stress,
                    "l1_translation_json": {"uz": uz},
                    "theme": theme,
                    "part_of_speech": pos,
                    "gender": gender,
                    "plural_form": plural,
                    "freq_rank": freq,
                    "is_cognate_uz": cognate,
                },
            )
            words.append(word)

        # Yangi struktura: new_items (tipli) + games (obyektlar). Dvigatel option_count'ni
        # schema_json diapazonidan (age_band bo'yicha) tanlaydi — config'da QOTIRILMAYDI.
        new_items = [{"type": "word", "id": str(w.id)} for w in words]

        def games(keys):
            built = []
            for k in keys:
                g = {"type": k}
                if k == "eshit_va_bos":
                    g["distractors"] = {"source": "theme", "exclude_confusable": True}
                elif k == "juftla":
                    g["pair_mode"] = "image-audio"
                built.append(g)
            return built

        lesson, _ = Lesson.objects.get_or_create(
            theme=theme,
            order=1,
            defaults={
                "title_uz": f"{title_uz} — 1-dars",
                "title_ru": title_ru,
                "min_age_band": "3-4",
            },
        )
        steps = [
            (
                1,
                StepKind.INTRO,
                {"new_items": new_items, "games": games([game_keys[0]])},
            ),
            (2, StepKind.PRACTICE, {"new_items": new_items, "games": games(game_keys)}),
            (
                3,
                StepKind.MASTERY,
                {"new_items": new_items, "games": games([game_keys[0]])},
            ),
        ]
        # update_or_create — config_json shakli o'zgarsa mavjud qadamlar ham yangilanadi (idempotent)
        for step_order, kind, cfg in steps:
            LessonStep.objects.update_or_create(
                lesson=lesson,
                order=step_order,
                defaults={"kind": kind, "config_json": cfg},
            )

    def _seed_alphabet(self, level, ru):
        """Alifbo mavzusi: 1-guruh harf darsi (harf mexanikalari) + so'z qurish darsi (soz_qur)."""
        theme, _ = Theme.objects.get_or_create(
            level=level,
            key="alphabet",
            defaults={
                "order": 3,
                "title_uz": "Alifbo",
                "title_ru": "Алфавит",
                "icon": "🔤",
            },
        )
        group1 = list(Letter.objects.filter(language=ru, group_no=1).order_by("order"))
        letter_items = [{"type": "letter", "id": str(ltr.id)} for ltr in group1]

        # 1-dars: harf tanish/tovush/chizish (5-6)
        lesson1, _ = Lesson.objects.get_or_create(
            theme=theme,
            order=1,
            defaults={
                "title_uz": "Alifbo — 1-guruh",
                "title_ru": "Алфавит — 1",
                "min_age_band": "5-6",
            },
        )
        steps1 = [
            (
                1,
                StepKind.INTRO,
                {"new_items": letter_items, "games": [{"type": "harf_ovi"}]},
            ),
            (
                2,
                StepKind.PRACTICE,
                {
                    "new_items": letter_items,
                    "games": [
                        {"type": "harf_ovi"},
                        {"type": "qaysi_tovush"},
                        {"type": "harf_chiz"},
                    ],
                },
            ),
            (
                3,
                StepKind.MASTERY,
                {"new_items": letter_items, "games": [{"type": "harf_ovi"}]},
            ),
        ]
        for o, k, cfg in steps1:
            LessonStep.objects.update_or_create(
                lesson=lesson1, order=o, defaults={"kind": k, "config_json": cfg}
            )

        # 2-dars: so'z qurish (6-7) — qisqa so'zlar harflaridan
        short = list(
            Word.objects.filter(language=ru, lemma__in=[w[0] for w in SHORT_WORDS])
        )
        word_items = [{"type": "word", "id": str(w.id)} for w in short]
        lesson2, _ = Lesson.objects.get_or_create(
            theme=theme,
            order=2,
            defaults={
                "title_uz": "So'z qurish",
                "title_ru": "Собери слово",
                "min_age_band": "6-7",
            },
        )
        steps2 = [
            (
                1,
                StepKind.INTRO,
                {"new_items": word_items, "games": [{"type": "soz_qur"}]},
            ),
            (
                2,
                StepKind.PRACTICE,
                {"new_items": word_items, "games": [{"type": "soz_qur"}]},
            ),
            (
                3,
                StepKind.MASTERY,
                {"new_items": word_items, "games": [{"type": "soz_qur"}]},
            ),
        ]
        for o, k, cfg in steps2:
            LessonStep.objects.update_or_create(
                lesson=lesson2, order=o, defaults={"kind": k, "config_json": cfg}
            )
