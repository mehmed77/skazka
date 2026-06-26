---
name: srs-engine
description: SKAZKA ko'rinmas SRS (interval takrorlash) dvigatelini qurish — learning app, ChildWordState, LearningEvent, get_session_queue. Xotira/takrorlash logikasi, due-API yoki retrievalni o'yinga to'qish ustida ishlaganda ishlat.
---

# SKAZKA SRS dvigateli (learning app) — SPEC §4

Bu — platformaning **eng muhim va eng murakkab** qismi: ko'rinmas, bolaga moslashtirilgan interval
takrorlash. Kattalardagi flashcard (Anki) EMAS. Modellar `apps/learning/`. Bu — Faza 6 ishi.
Pedagogik asos: `docs/01-Loyiha/Pedagogik-Asos.md`, arxitektura: `docs/02-Arxitektura/SRS-Dvigateli.md`.

## Asosiy g'oya
Har (bola × so'z/harf) uchun **xotira holati** saqlanadi. Bola so'zni o'yin ichida har "uchratganda",
natija (to'g'ri/xato + javob tezligi) yoziladi → so'zning **keyingi takror vaqti** qayta hisoblanadi.
"Muddati kelgan" so'z keyingi o'ynaydigan o'yiniga **ko'rinmas** qo'shiladi (alohida "takrorlash" sessiyasi yo'q).

## Modellar
- `ChildWordState(child→, word→, box_no|stability, difficulty, due_at, last_result, exposures, receptive_mastery, expressive_mastery, updated_at)` — dvigatel yuragi.
- `ChildLetterState(...)` — harflar uchun shunga o'xshash (Trek A, Faza 7).
- `LearningEvent(child→, item_type[word|letter], item_id, game_type, is_correct, latency_ms, hint_used, session_id, ts)` — SRS haydovchi + analitika.
- `SessionLog(...)`.

## Algoritm (bosqichli)
1. **MVP — Leitner qutilari** (kengayuvchi intervallar): Quti 1→1kun, 2→3, 3→7, 4→14, 5→30, 6→mastered.
   To'g'ri → keyingi qutiga; xato → 1-qutiga (yumshoq, jazo emas). `due_at <= now` → ustuvor.
2. **Keyin — FSRS-lite:** `stability`/`difficulty` saqlab, interval = f(stability, difficulty, natija, latency).
   Interfeysni shu o'tishga moslab qur (MVP'da box_no, keyin stability).

## Xizmat interfeysi (`apps/learning/services.py`)
- `record_result(child, item, correct, latency)` → box/due_at yangilanadi.
- `get_due(child, limit)` → muddati kelgan so'z/harflar.
- `get_session_queue(child)` → `interleave(get_due, curriculum.get_next_new)` — **semantik interferensiyani oldini olib** (o'xshash so'zlar yonma-yon emas).

## API
- `POST /api/v1/learning/event/` — natija yozish (child-context token).
- `GET /api/v1/learning/session/` — o'yin navbati.
- Offline: javoblar outbox'ga, onlayn bo'lganda **idempotent** sync (SPEC §9.3, Faza 10).

## Qoidalar
- Reseptiv (tanish) → ekspressiv (aytish) ikki bosqichli mastery. 3–4 yosh: faqat reseptiv; 5+ : ekspressiv boshlanadi.
- Retrieval o'yin **ichida** sodir bo'ladi (kartochka emas). Bola "takrorlash" so'zini ko'rmaydi.
- Har model `apps.common.BaseModel` dan meros oladi. `LearningEvent` katta o'sadi → indeks/partitioning'ni rejalashtir.
