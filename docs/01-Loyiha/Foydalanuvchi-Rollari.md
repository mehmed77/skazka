---
title: Foydalanuvchi Rollari
type: loyiha
tags: [loyiha, rollar, rbac, coppa]
status: tasdiqlangan
created: 2026-06-26
---

# 👥 Foydalanuvchi Rollari

> [!abstract] Bog'liq: [[02-Arxitektura/Xavfsizlik|🔐 Xavfsizlik]] · [[06-Modullar/Accounts|👤 Accounts moduli]] · [[01-Loyiha/Funksional-Talablar|✅ Funksional talablar]] · [[SPEC]]

SKAZKA foydalanuvchi modeli COPPA/GDPR-K ruhida qurilgan (SPEC §8): **bitta
ota-ona akkaunti → bir nechta bola profili**. Bolaga alohida login YO'Q.

## 👤 Ota-ona (ParentAccount)
> [!success] To'liq egalik
- Email yoki telefon + parol bilan ro'yxat/kirish (JWT) → [[06-Modullar/Accounts]].
- Bir nechta **bola profili** yaratadi, tahrirlaydi, almashtiradi.
- **Ota-ona paneli:** rivoj (qaysi so'z o'rganildi, mastery), vaqt cheklovi, hisobot.
- Sozlama/xaridga kirishdan oldin **Parent Gate** (kattalar tekshiruvi).

## 🐻 Bola (ChildProfile — walled garden)
> [!info] Devor bilan o'ralgan bog'
- Profil: ism/taxallus + avatar + yosh-diapazon (`age_band`) + ona tili (`uz`).
- **Bola haqida minimal ma'lumot** — alohida login/email yo'q.
- Profilga o'tish: **ota-ona sessiyasi ichida** (ixtiyoriy PIN), alohida auth emas.
- Bola rejimida: chat yo'q, reklama yo'q, tashqi havola yo'q, ochiq internet yo'q.

## 🔐 Admin
> [!success] Kontent va tizim
- Django Admin orqali kurikulum, harf, so'z, media, ertak/qo'shiq boshqaradi → [[06-Modullar/Kontent]].
- Foydalanuvchi/litsenziya nazorati; analitika (anonim/agregat).

## 🏛️ Institut (kelajak — B2B)
> [!info] Faza 11
- Bog'cha/markaz: o'z brendingi (rang/logo/feature-flag) + `ModuleLicense` → [[06-Modullar/Billing]].
- `/api/config/` orqali brending uzatiladi.

## ✅ Qobiliyat / Ruxsatlar jadvali

| Imkoniyat | Ota-ona | Bola | Admin | Institut |
|---|:---:|:---:|:---:|:---:|
| Ro'yxat/kirish (login) | ✅ | ❌ | ✅ | ✅ |
| Profil yaratish/tahrir | ✅ (bola profili) | ❌ | ✅ | 🟡 |
| O'yin/dars o'ynash | — | ✅ | — | — |
| Rivoj/hisobotni ko'rish | ✅ (o'z bolasi) | ❌ | ✅ (agregat) | 🟡 (litsenziya doirasi) |
| Vaqt cheklovi sozlash | ✅ | ❌ | — | — |
| Kontent boshqarish (CRUD) | ❌ | ❌ | ✅ | ❌ |
| Brending/litsenziya | ❌ | ❌ | ✅ | 🟡 |

> Belgilar: 🟡 = cheklangan / kelajakda. To'liq matritsa → [[02-Arxitektura/Xavfsizlik#Ruxsatlar matritsasi]].

## 🔐 PII minimallashtirish (COPPA/GDPR-K)

> [!warning] Bolalar maxfiyligi — majburiy
> - Bolalardan **keraksiz shaxsiy ma'lumot yig'ilmaydi** (ism taxallus bo'lsa ham bo'ladi).
> - Tahlil — **anonim / agregat**; LearningEvent shaxsni ochmaydi.
> - Ota-ona PIN orqali profilga o'tish; xaridga Parent Gate.
> - Batafsil → [[02-Arxitektura/Xavfsizlik]] va [[01-Loyiha/Nofunksional-Talablar#NFR — Maxfiylik]].
