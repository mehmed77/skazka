---
title: SRS / Learning moduli (yadro)
type: modul
tags: [modul/learning, modul/srs, loyiha, prioritet/high]
status: bajarildi
faza: Faza 6
created: 2026-06-26
---

# 🧠 SRS / Learning moduli (yadro)

> Faza 6 · Bog'liq: [[02-Arxitektura/SRS-Dvigateli]] · [[06-Modullar/Oyin-Mexanikalari]] · [[06-Modullar/Kontent]] · [[SPEC]]

SPEC §4: platformaning **eng muhim va eng murakkab** qismi — **ko'rinmas SRS** (Anki emas, bolaga moslangan). Har bola × har so'z/harf uchun xotira holati saqlanadi; muddati kelgan so'z keyingi o'yinga **ko'rinmas** qo'shiladi.

> [!abstract] YADRO modul
> Bu modul boshqa hamma o'yinning haydovchisi: kontent qaysi so'zni, qachon ko'rsatishini
> shu yer hal qiladi. Algoritm tafsiloti → [[02-Arxitektura/SRS-Dvigateli]].

> [!success] Bajarildi (Faza 6 MVP — 2026-06-27 · [[99-Resurslar/Qaror-Jurnali#ADR-013 — SRS dvigateli: izolyatsiyalangan scheduler + idempotent event + polimorfik ItemState|ADR-013]])
> `apps/learning`: **ItemState** (polimorfik word|letter, FSRS-tayyor + reseptiv/ekspressiv kuch) +
> **LearningEvent** (`event_id` idempotentlik). **`scheduler.schedule()`** izolyatsiya (MVP SM-2-lite,
> almashtiriladigan). `record_event` (idempotent) + `get_due`. Endpointlar: `POST /learning/event/`,
> `GET /learning/session/`. **Progress REAL+LINEER** (curriculum overlay + ETag stamp). Frontend:
> `recordResult` outbox→sync, `useSessionQueue` due interleave, Takrorlash plugin. pytest 44/44.
> **Faza 7:** ekspressiv strength ISHGA TUSHDI — `schedule(state, correct, latency, dimension)`;
> so'z_qur/harf_chiz → expressive, harf_ovi/qaysi_tovush → receptive (`GameType.dimension`, [[99-Resurslar/Qaror-Jurnali#ADR-014 — Harf mexanikalari: acceptsItemTypes + schedule(dimension) + yumshoq tracing|ADR-014]]).
> Letterlar polimorfik ItemState'ga kiradi (due+takrorlash). Qolgan: to'liq FSRS sozlash (Faza 10), SessionLog (keyin).

> [!note] Faza 5'da frontend kontrakti QO'YILDI (ADR-010 / [[99-Resurslar/Qaror-Jurnali#ADR-012 — O'yin dvigateli: registry plugin + frontend distraktor|ADR-012]])
> O'yin dvigateli (Faza 5) Faza 6 ulanishini kutib quyidagi interfeyslarni allaqachon chaqiradi —
> **Faza 6 ularni real qiladi, `GamePlayer` o'zgarmaydi:**
> - `lib/games/session.buildSessionQueue(newItems, dueItems=[])` — hozir `due=[]` (faqat dars so'zlari, confusable yonma-yon emas). Faza 6: `dueItems = srs.get_due(child)` → `interleave`.
> - `lib/learningEvents.recordResult(...)` — hozir `localStorage` outbox (`item_type/item_id/game_type/is_correct/latency_ms/hint_used` — `LearningEvent` maydonlariga 1:1). Faza 6: `POST /api/v1/learning/event/` (outbox sync).

## Modellar (SPEC §10)

| Model | Asosiy maydonlar |
|---|---|
| `ChildWordState` | `child`, `word`, `box_no`(1–6)\|`stability`, `difficulty`, `due_at`, `last_result`, `exposures`, `receptive_mastery`, `expressive_mastery`, `updated_at` |
| `ChildLetterState` | `child`, `letter`, `box_no`\|`stability`, `due_at`, ... |
| `LearningEvent` | `child`, `item_type`, `item_id`, `game_type`, `is_correct`, `latency_ms`, `hint_used`, `session_id`, `ts` |
| `SessionLog` | `child`, `started_at`, `ended_at`, `items_count` |

## Algoritm (MVP: Leitner)
- Quti 1→1 kun, 2→3, 3→7, 4→14, 5→30, 6→o'zlashtirildi.
- To'g'ri → keyingi quti; xato → 1-quti (yumshoq, **jazo emas**).
- `due_at <= now` → keyingi o'yinga ustuvor.
- **Reseptiv → Ekspressiv:** 3–4 yosh faqat reseptiv; 5+ yoshda reseptiv mustahkam bo'lgach ekspressiv.
- Keyingi iteratsiya: FSRS-lite (`stability`/`difficulty`) — interfeys shunga moslab quriladi.

## get_session_queue (weaving)

```python
def get_session_queue(child):
    due_words = srs.get_due(child, limit=N)        # muddati kelgan
    new_words = curriculum.get_next_new(child, M)  # yangi so'zlar
    return interleave(due_words, new_words)        # semantik interferensiyasiz
```

Har so'z mos `GameType`'da ko'rsatiladi → har javob `LearningEvent` → SRS yangilanadi.

## API (`/api/v1/learning/`)
- `POST /event/` — har o'zaro ta'sir natijasi (oflayn → outbox → keyin sync).
- `GET /session/` — o'yin navbati (`interleave(due, yangi)`).
- `record_result(child, item, correct, latency)` — `box`/`due_at` yangilash (xizmat funksiyasi).

## Acceptance
- [ ] O'rganilgan so'z kengayuvchi intervallarda qaytadi; xato so'z tezroq qaytadi.
- [ ] Barcha javoblar `LearningEvent`'ga yoziladi.
- [ ] `get_session_queue` due + yangi'ni semantik interferensiyasiz aralashtiradi.
- [ ] `/event` va `/session` API child-context bilan ishlaydi (oflayn outbox sync).
- [ ] Bola "takrorlash" so'zini ko'rmaydi (ko'rinmas SRS).
