---
title: Ma'lumotlar Bazasi (ERD)
type: arxitektura
tags: [arxitektura, baza, erd, model]
status: tasdiqlangan
created: 2026-06-26
---

# 🗄️ Ma'lumotlar Bazasi (ERD)

> Bog'liq: [[02-Arxitektura/Tizim-Arxitekturasi]] · [[02-Arxitektura/SRS-Dvigateli]] · [[06-Modullar/Kontent]] · [[06-Modullar/Accounts]]

SPEC §10 dagi asosiy entitilardan kelib chiqqan ma'lumotlar modeli. To'liq DDL emas —
Django modellari shu asosda fazalarda yaratiladi (hozir skeleton **modelsiz**).

## ER diagramma

```mermaid
erDiagram
    PARENT_ACCOUNT ||--o{ CHILD_PROFILE : "has"
    PARENT_ACCOUNT ||--o| SUBSCRIPTION : "has"
    INSTITUTION ||--o{ BRANDING_CONFIG : "scopes"
    INSTITUTION ||--o{ PARENT_ACCOUNT : "licenses"
    LANGUAGE ||--o{ LEVEL : "has"
    LEVEL ||--o{ THEME : "has"
    THEME ||--o{ LESSON : "has"
    LESSON ||--o{ LESSON_STEP : "has"
    LANGUAGE ||--o{ LETTER : "has"
    LANGUAGE ||--o{ WORD : "has"
    THEME ||--o{ WORD : "groups"
    THEME ||--o{ SONG : "has"
    LEVEL ||--o{ STORY : "has"
    GAME_TYPE ||--o{ LEARNING_EVENT : "logged_in"
    MEDIA ||--o{ WORD : "audio/image"
    MEDIA ||--o{ LETTER : "audio/mnemonic"
    CHILD_PROFILE ||--o{ CHILD_WORD_STATE : "tracks"
    WORD ||--o{ CHILD_WORD_STATE : "stated_by"
    CHILD_PROFILE ||--o{ LEARNING_EVENT : "produces"
    CHILD_PROFILE ||--o{ REWARD : "earns"

    PARENT_ACCOUNT {
        uuid id PK
        string email_or_phone UK
        string password_hash "argon2"
        string locale "uz"
        uuid institution_id FK "nullable, B2B"
        datetime created_at
    }
    CHILD_PROFILE {
        uuid id PK
        uuid parent_id FK
        string display_name
        uuid avatar_id FK
        enum age_band "3-4|5-6|6-7"
        string l1_locale "uz"
        uuid current_level_id FK
        string pin_optional "nullable"
        datetime created_at
    }
    LANGUAGE {
        uuid id PK
        string code "ru|uz"
        string name
    }
    LEVEL {
        uuid id PK
        uuid language_id FK
        int order
        string title_uz
        string title_ru
    }
    THEME {
        uuid id PK
        uuid level_id FK
        int order
        string key "hayvonlar|ranglar..."
        string title_uz
        string title_ru
        string icon
    }
    LESSON {
        uuid id PK
        uuid theme_id FK
        int order
        string title_uz
        string title_ru
        enum min_age_band "3-4|5-6|6-7"
    }
    LESSON_STEP {
        uuid id PK
        uuid lesson_id FK
        int order
        enum kind "intro|practice|mastery"
        json config_json
    }
    LETTER {
        uuid id PK
        uuid language_id FK
        string char
        string sound_ipa
        uuid audio_id FK
        uuid mnemonic_image_id FK
        int group_no "1-4"
        int order
    }
    WORD {
        uuid id PK
        uuid language_id FK
        string lemma
        string translit
        json l1_translation_json
        uuid image_id FK
        uuid audio_native_id FK
        uuid theme_id FK
        int difficulty
        string part_of_speech
        bool is_cognate_uz
        int freq_rank
    }
    GAME_TYPE {
        uuid id PK
        string key
        string name
        string skill
        enum min_age_band
        json schema_json
    }
    STORY {
        uuid id PK
        uuid level_id FK
        string title
    }
    SONG {
        uuid id PK
        uuid theme_id FK
        string title
        uuid audio_id FK
        json lyrics_json
    }
    CHILD_WORD_STATE {
        uuid id PK
        uuid child_id FK
        uuid word_id FK
        int box_no "1-6 (Leitner)"
        float stability "FSRS-lite"
        float difficulty
        datetime due_at
        bool last_result
        int exposures
        bool receptive_mastery
        bool expressive_mastery
        datetime updated_at
    }
    LEARNING_EVENT {
        uuid id PK
        uuid child_id FK
        enum item_type "word|letter"
        uuid item_id
        uuid game_type_id FK
        bool is_correct
        int latency_ms
        bool hint_used
        uuid session_id
        datetime ts
    }
    REWARD {
        uuid id PK
        enum kind "sticker|collectible|customization"
        uuid asset_id FK
    }
    MEDIA {
        uuid id PK
        enum kind "audio|image|lottie"
        string storage_key
        int duration_ms
        json meta_json
    }
    SUBSCRIPTION {
        uuid id PK
        uuid parent_id FK
        string plan
        enum status
        date period_end
    }
    INSTITUTION {
        uuid id PK
        string name
        json branding_config_json
    }
    BRANDING_CONFIG {
        uuid id PK
        enum scope "global|institution"
        json theme_json
        json feature_flags_json
    }
```

## Asosiy modellar izohi

- **CHILD_WORD_STATE** — **dvigatel yuragi**: har bola × har so'z uchun xotira holati
  (Leitner `box_no` → keyin FSRS-lite `stability/difficulty`), `due_at`, reseptiv/ekspressiv
  mastery. To'liq mantiq → [[02-Arxitektura/SRS-Dvigateli]].
- **LEARNING_EVENT** — har o'zaro ta'sir yoziladi: ham SRS haydovchi, ham analitika.
  Katta o'sadi → kelajakda partitioning (`ts` bo'yicha).
- **PARENT_ACCOUNT → CHILD_PROFILE** — bitta ota-ona, ko'p bola. Bolaga alohida
  login **YO'Q**, faqat ota-ona sessiyasi ichida (PIN) → [[06-Modullar/Accounts]].
- **INSTITUTION + BRANDING_CONFIG** — `/api/config/` shu yerdan; B2B, bir platforma
  ko'p brending → [[06-Modullar/Billing]].

## Daraja kontent ierarxiyasi (state)

```mermaid
stateDiagram-v2
    [*] --> Tanishtirish
    Tanishtirish --> Mashq : intro tugadi
    Mashq --> Tekshiruv : practice o'yinlari
    Tekshiruv --> Mashq : o'zlashtirilmadi (yumshoq qayta)
    Tekshiruv --> Ozlashtirildi : mastery check OK
    Ozlashtirildi --> [*]
```

> [!note] Hisoblanadigan / signal bilan yangilanadigan
> - `due_at` — har `LearningEvent`'dan keyin `record_result` qayta hisoblaydi.
> - mastery foizi (ota-ona panel) — `ChildWordState` agregati.
> - semantik interferensiya filtri navbat tuzishda → [[02-Arxitektura/SRS-Dvigateli]].

## Indekslar va qidiruv
- `email_or_phone`, `(child_id, word_id)` → unique.
- `ChildWordState.due_at`, `(child_id, due_at)` → due-so'rovlar uchun indeks.
- `LearningEvent.ts`, `child_id` → analitika + partitioning kaliti.
