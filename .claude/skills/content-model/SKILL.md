---
name: content-model
description: SKAZKA kontent/kurikulum modelini (content app) yaratish — Language, Level, Theme, Lesson, Letter, Word, GameType, Story, Song. Kurikulum, harf/so'z kontenti yoki Django Admin/seed ustida ishlaganda ishlat.
---

# SKAZKA kontent modeli (content app) — SPEC §3, §10

Kontent ikkita parallel trekdan iborat (SPEC §3). Modellar `apps/content/models.py` da, hammasi
`apps.common.BaseModel` dan meros oladi. Bu — Faza 2 ishi.

## Ierarxiya
```
Language(code=ru, L1=uz)
  └─ Level(order)
       └─ Theme/Unit(key, title_uz, title_ru, icon)
            └─ Lesson(order, min_age_band)
                 └─ LessonStep(kind: intro|practice|mastery, config_json)
```

## Asosiy modellar (yo'nalish — to'liq DDL SPEC §10)
- `Language(code, name)`, `Level(language→, order, title_uz, title_ru)`.
- `Theme(level→, order, key, title_uz, title_ru, icon)`, `Lesson(theme→, order, title_uz, title_ru, min_age_band)`.
- `LessonStep(lesson→, order, kind[intro|practice|mastery], config_json)`.
- **Trek A (alifbo):** `Letter(language→, char, sound_ipa, audio→Media, mnemonic_image→Media, group_no, order)`.
- **Trek B (so'z boyligi):** `Word(language→, lemma, translit, l1_translation_json, image→Media, audio_native→Media, theme→, difficulty, part_of_speech, gender, plural_form, freq_rank, is_cognate_uz)`.
- `Phrase`, `GameType(key, name, skill, min_age_band, schema_json)`, `Story`+`StoryNode`, `Song`.

## Muhim qoidalar
- **Audio-birinchi, dual coding:** har `Word`/`Letter` da rasm + ona tilidagi audio (`media` app, MinIO). Hech qachon faqat matn.
- **Kognat afzalligi:** `is_cognate_uz=True` so'zlarni (stol, park, avtobus...) birinchi o'rgatish — tez g'alaba (SPEC §3).
- **Semantik interferensiya:** o'xshash so'zlarni (mishka/mushka) bir vaqtda berma — bu SRS navbatida hisobga olinadi ([[srs-engine]]).
- **GameType data-driven:** mexanika kontentdan mustaqil; yangi so'z qo'shilsa hamma o'yin avtomatik ishlaydi (SPEC §5).
- `min_age_band` (3–4 / 5–6 / 6–7) bo'yicha murakkablik tabaqalanadi (SPEC §2.8).

## Admin + seed
- Django Admin: inline'lar (Lesson ichida LessonStep, Theme ichida Lesson), media yuklash maydonlari.
- `python manage.py seed_demo` (`apps/content/management/commands/seed_demo.py`) — hozir placeholder.
  Faza 2'da: ru + Level 1, 1-harf guruhi (А,О,К,М,Т,С,Н,И), 2 mavzu ("Hayvonlar (uy)", "Ranglar"), GameType katalogi (11 mexanika).
