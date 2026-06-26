---
title: O'yin mexanikalari
type: modul
tags: [modul/games, loyiha, prioritet/high]
status: rejada
faza: Faza 5, 7, 9
created: 2026-06-26
---

# 🎮 O'yin mexanikalari

> Faza 5/7/9 · Bog'liq: [[06-Modullar/SRS-Learning]] · [[06-Modullar/Kontent]] · [[06-Modullar/Dizayn-Tizimi]] · [[01-Loyiha/Pedagogik-Asos]]

SPEC §5: har mexanika **ko'nikma + retrieval** turiga bog'langan va `GameType` katalogida saqlanadi. Dars o'z so'zlarini shu mexanikalarga "quyadi" — har biri **data-driven** (kontentdan mustaqil).

> [!info] Faza 4'da tayyorlangan poydevor (o'yin LOGIKASI Faza 5)
> - `GameType` katalogi (11 mexanika + `schema_json`) — Faza 2; `config_json.games` (per-o'yin params) — Faza 2.5.
> - `/lesson/{id}` to'liq resolve qilingan kontent (so'z+media URL+games+schema+confusable) — Faza 3.
> - **Feedback komponentlari tayyor (Faza 4):** `Confetti` (to'g'ri javob), `Mishka` `cheer`/`celebrate` holatlari, `useAudio`.
> - **Faza 5:** `GamePlayer` (config→render) + dars oqimi (intro→practice→mastery) + 3 mexanika + distractor tanlash (`exclude_confusable`). Bola zonasi qobig'i (`/forest`) tayyor → [[06-Modullar/Dizayn-Tizimi]].

## 11 mexanika (SPEC §5)

| # | O'yin (uz / ru) | Ko'nikma | Retrieval turi | Yosh | Faza |
|---|---|---|---|---|---|
| 1 | Eshit va bos / «Слушай и нажми» | So'z↔rasm (reseptiv) | Tanib olish | 3+ | 5 |
| 2 | Juftla / «Найди пару» | Rasm↔audio/rasm | Xotira + tanib olish | 3+ | 5 |
| 3 | Topib ber / «Покажи …» (TPR) | Sahnada topish | Kontekstli tanib olish | 3+ | 5 |
| 4 | Harf ovi / «Где буква?» | Harfni tanish | Harf tanib olish | 5+ | 7 |
| 5 | Harf chiz / «Обведи букву» | Harf yozish (motor) | Ishlab chiqarish (motor) | 5+ | 7 |
| 6 | Qaysi tovush? / «Какой звук?» | Tovush→harf | Fonematik | 5+ | 7 |
| 7 | So'z qur / «Собери слово» | Bo'g'in/harfdan so'z | Ishlab chiqarish | 6+ | 7 |
| 8 | Sehrli ertak / «Сказка» (TPRS) | So'z kontekstda | Kontekstli, tanlovli | 5+ | 9 |
| 9 | Qo'shiq / «Песенка» | So'z+musiqa+harakat | Ko'p sezgili | 3+ | 9 |
| 10 | Aytib ber / «Скажи!» (ASR) | So'zni aytish | Ekspressiv (ovozli) | 5+ | 11 |
| 11 | Takrorlash o'yini / «Повторюшка» | Aralash, muddati kelgan | Aralash retrieval | 4+ | 6 |

## Data-driven GamePlayer

```mermaid
flowchart LR
    GT[GameType.schema_json] --> GP[GamePlayer]
    CW[Dars so'z/harf + Media] --> GP
    DUE[SRS navbat] --> GP
    GP -->|render| UI[Mini-o'yin UI]
    UI -->|javob| EV["LearningEvent yoziladi"]
    EV --> SRS[[06-Modullar/SRS-Learning]]
```

Yangi so'z qo'shilsa — hamma o'yin avtomatik ishlaydi (mexanika kontentga bog'lanmagan). Umumiy `GamePlayer` `GameType.schema_json` + kontent + SRS navbatini birlashtirib render qiladi.

## Feedback qoidalari (jazo YO'Q)
> [!success] To'g'ri javob
> Mishka quvonadi, konfetti, yoqimli tovush — darhol, bo'rttirilgan ijobiy feedback (Duolingo uslubi).

> [!question] Xato javob
> Jazo yo'q. Mishka "qayta urinaylik" deydi → maslahat (rasm yiriklashadi / audio qayta yangraydi) → qayta imkon.

- **Kichiklar (3–4):** ekranda 2 ta tanlov, taymer yo'q.
- Har javob → `LearningEvent` → SRS yangilanadi → [[06-Modullar/SRS-Learning]].

## Acceptance
- [ ] `GamePlayer` `GameType.schema_json` asosida data-driven render qiladi.
- [ ] 3 mexanika (Eshit va bos, Juftla, Topib ber) Faza 5'da to'liq o'ynaladi.
- [ ] Dars oqimi: intro → practice → mastery → natija ekrani.
- [ ] To'g'ri/xato feedback (jazosiz) ishlaydi; har javob LearningEvent'ga yoziladi.
- [ ] Yangi so'z qo'shilganda hech bir mexanikaga qo'l tegmaydi (avtomatik).
