---
title: Maqsad va Vizyon
type: loyiha
tags: [loyiha, vizyon, maqsad, prioritet/high]
status: tasdiqlangan
created: 2026-06-26
---

# 🎯 Maqsad va Vizyon

> [!abstract] Bog'liq: [[01-Loyiha/Pedagogik-Asos|🧠 Pedagogik asos]] · [[01-Loyiha/SPEC-Tahlili|📄 SPEC tahlili]] · [[00-Home|🏠 Bosh sahifa]] · [[SPEC]]

## 🐻 Vizyon

**SKAZKA** — 3–7 yoshli o'zbek bolalariga rus tilini **o'yin orqali**, ilmiy
metodika bilan, stresssiz o'rgatadigan platforma. Maskot **Mishka** (ayiqcha)
bola bilan birga sayohat qiladi. Asosiy g'oya (SPEC §1): pedagogik jihatdan
isbotlangan metodlarni (TPR, comprehensible input, dual coding, interval
takrorlash) bolalar sevadigan o'yin qobig'iga **ko'rinmas** tarzda joylash —
bola o'ynayotganini his qiladi, aslida tizim xotirasini ilmiy jadval bo'yicha
mustahkamlaydi.

## 🎯 Asosiy maqsadlar

1. **Ilmiy + qiziqarli** — metodika sustligi va "bo'sh o'yin" muammosini birga yechish.
2. **Ko'rinmas so'z-yodlash dvigateli** — har so'z kerakli vaqtda keyingi o'yinda qaytadi → [[02-Arxitektura/SRS-Dvigateli]].
3. **Audio-birinchi** — bola o'qiy olmaydi; hamma narsa ovoz bilan tushuntiriladi.
4. **Ota-ona nazorati** — rivoj, vaqt cheklovi, hisobot bitta panelda.
5. **Qayta sotiladigan** — bir platforma, ko'p brending (B2B litsenziya).

## ⚙️ Mahsulot tamoyillari (SPEC §1)

| Tamoyil | Mazmuni |
|---|---|
| **Audio-birinchi** | Har ekran ovozli; matnga tayanmaydi. |
| **O'yin = o'rganish** | Har mexanika aniq ko'nikma + xotira mexanizmiga bog'liq. |
| **Stresssiz** | Yutqazish, jazo, taymer yo'q; xato → yumshoq qayta urinish. |
| **Xavfsiz bog' (walled garden)** | Reklama, chat, tashqi havola, ochiq internet yo'q. |
| **Ota-ona — sherik** | Panel orqali rivojni ko'radi, vaqtni boshqaradi. |
| **B2B-ready** | Bog'cha/markazlarga litsenziya bilan sotiladigan brending. |

## 🚫 Maqsad EMAS (Non-goals)

> [!warning]
> - ❌ Kattalar ilovasidan moslashtirilgan og'ir interfeys emas.
> - ❌ Metodikasiz "bo'sh o'yin" emas (har mexanika xotira mexanizmiga bog'liq).
> - ❌ Ball/liderboard/raqobatga asoslangan tashqi motivatsiya emas (SPEC §6).
> - ❌ Bolaga alohida login/email/ijtimoiy funksiya YO'Q (SPEC §8).
> - ❌ Ekran vaqtiga majburlovchi "dark pattern" yo'q — vaqt ota-ona qo'lida.

## 👥 Maqsadli auditoriya (3–7 yosh)

| Yosh | Diqqat | Yondashuv (qisqacha) |
|---|---|---|
| **3–4** | ~3–5 daq | Sof eksploratsiya, reseptiv, 2 ta tanlov, ko'p qaytariq |
| **5–6** | ~5–8 daq | Yengil maqsad, kolleksiya, harflar boshlanadi |
| **6–7** | ~8–12 daq | So'z qurish, ertak, fonetika, tracing |

> Batafsil daraja-tabaqalashtirish → [[01-Loyiha/Pedagogik-Asos#📊 Daraja-tabaqalashtirilgan yondashuv (3–4 vs 5–7)]].

> [!info] Joriy holat (Faza 0 bajarildi)
> Skeleton + Docker tayyor; biznes-logika keyingi fazalarda → [[03-Reja/Bosqichlar]].
