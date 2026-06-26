---
title: Dizayn tizimi
type: modul
tags: [modul/design, loyiha, prioritet/high]
status: rejada
faza: Faza 4
created: 2026-06-26
---

# 🎨 Dizayn tizimi

> Faza 4 · Bog'liq: [[06-Modullar/Oyin-Mexanikalari]] · [[06-Modullar/Geymifikatsiya]] · [[01-Loyiha/Foydalanuvchi-Rollari]] · [[02-Arxitektura/Texnologiyalar-Steki]]

SPEC §7: bola **o'qiy olmaydi** — bosh qoida **audio-birinchi, matnsiz, ulkan teginish nishonlari**. Maskot — Mishka (ayiqcha), auditoriya 3–7 yosh.

## Asosiy UX tamoyillari (SPEC §7.1)
- **Audio-birinchi:** har ekran ovoz bilan; element bosilganda nomi yangraydi (`useAudio` hook, Web Audio API).
- **Soddalik (Toca Boca):** kichiklar uchun ekranda 1–2 tanlov; diqqat jismoniy ta'sirga.
- **Ulkan teginish nishonlari:** min ~80–100px, oraliq keng (kichik barmoqlar).
- **Darhol feedback:** har teginishda tovush + animatsiya.
- **Maskot-boshqaruvi:** navigatsiya Mishka orqali, menyu emas → [[06-Modullar/Geymifikatsiya]].

## Dizayn tokenlari (CSS o'zgaruvchilari — frontend `globals.css`)

| Token | Maqsad |
|---|---|
| `--color-*` | Issiq, yorqin, yuqori kontrast; **rang-ko'r xavfsiz** palitra (rang yagona ma'no tashimaydi — doim + shakl/ikona) |
| `--radius-*` | Yumaloq, do'stona shakllar; o'tkir burchak yo'q |
| `--space-*` | Keng oraliq (ulkan nishonlar uchun) |
| `--shadow-*` | Yumshoq soyalar |
| `--font-*` | Kattalar zonasi uchun aniq, yumaloq shrift (bolalar zonasida matn deyarli yo'q) |

> [!tip] Shablon-default'dan qoching
> `frontend-design` skill tamoyillari: izchil palitra/spacing/typography, o'ziga xos iliq
> bolalarbop identitet. B2B brending tokenlari runtime'da almashinadi → [[06-Modullar/Billing]].

## Mishka maskot holatlari

```mermaid
stateDiagram-v2
    [*] --> idle
    idle --> cheer: to'g'ri javob
    idle --> think: kutish / topshiriq
    cheer --> celebrate: dars tugadi
    think --> idle: qayta urinish
    celebrate --> idle
```

| Holat | Qachon | Aktiv |
|---|---|---|
| `idle` | bo'sh turish | Lottie/sprite |
| `cheer` | to'g'ri javob | quvonish, qarsak, "ofarin!" |
| `think` | topshiriq/kutish | o'ylanish |
| `celebrate` | dars/yutuq | konfetti, alqash |

## Animatsiya va audio
- **Framer Motion / GSAP** — yumshoq, o'ynoqi, **chalg'itmaydigan** o'tishlar.
- **Web Audio API** — past kechikishli tovush; musiqa/qo'shiq alohida trek → [[06-Modullar/Media]].
- Uzluksiz interaktivlik: har teginish animatsion javob beradi.

## Parent Gate (SPEC §7.4)
> [!warning] Kattalar tekshiruvi
> Sozlama/xaridga kirishdan oldin: oddiy matematik misol yoki "uzoq bosib turing" —
> bola tasodifan kira olmasin → [[06-Modullar/Accounts]].

## Acceptance
- [ ] Dizayn tokenlari `globals.css`'da CSS o'zgaruvchilari sifatida (palitra/radius/spacing/typography).
- [ ] Tugmalar min 80–100px, rang-ko'r xavfsiz palitra (rang + shakl/ikona).
- [ ] Audio-birinchi: element bosilganda nomi yangraydi, ovozli ko'rsatma.
- [ ] Mishka maskot 4 holat (idle/cheer/think/celebrate) bilan ishlaydi.
- [ ] Framer Motion silliq o'tishlar; PWA o'rnatiladigan, to'liq ekran.
- [ ] Parent Gate sozlama/xaridni himoyalaydi.
