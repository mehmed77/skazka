---
title: Xavfsizlik
type: arxitektura
tags: [arxitektura, xavfsizlik, rbac, security]
status: tasdiqlangan
created: 2026-06-26
---

# 🔐 Xavfsizlik

> Bog'liq: [[01-Loyiha/Foydalanuvchi-Rollari]] · [[01-Loyiha/Nofunksional-Talablar]] · [[02-Arxitektura/API-Dizayni]] · [[06-Modullar/Accounts]]

> [!abstract] Tamoyil
> SKAZKA — bolalar mahsuloti. Xavfsizlik **COPPA / GDPR-K ruhida** quriladi:
> bola uchun **devor bilan o'ralgan bog'** (walled garden), PII minimallashtirish,
> ota-ona darvozasi (Parent Gate). SPEC §8, §7.4.

## 🐻 Bola rejimi — walled garden
- **Reklama yo'q · chat yo'q · tashqi havola yo'q · ochiq internet yo'q · ijtimoiy funksiya yo'q.**
- Bolaga **alohida login/email YO'Q** — faqat ota-ona sessiyasi ichida.
- Profilga o'tish: ota-ona JWT ichida **PIN** + child-context token → [[02-Arxitektura/API-Dizayni]].
- Tahlil — **anonim/agregat**; bolalardan keraksiz shaxsiy ma'lumot yig'ilmaydi.

## 👨‍👩‍👧 Parent Gate (ota-ona darvozasi)
Sozlamalar/xaridlarga kirishdan oldin **kattalar tekshiruvi** (COPPA uslubi):
oddiy matematik misol yoki "uzoq bosib turing" — bola tasodifan kira olmasin.
Frontend komponent → [[06-Modullar/Accounts]].

## Autentifikatsiya
- Ota-ona: email/telefon + parol.
- Parollar **`argon2`** bilan hash (Django default'dan kuchliroq).
- JWT (SimpleJWT): qisqa umrli `access` (~15 min) + `refresh` (rotatsiya).
- **Child-context token** — bola rejimi uchun qisqa umrli, `child_id` ichida.
- Brute-force: login rate-limit (Nginx + DRF throttle).

## Role-Based Access Control (RBAC)
Rollar → [[01-Loyiha/Foydalanuvchi-Rollari]]. DRF `Permission` + `QuerySet` filtri:
- **Ota-ona** — faqat o'z `ChildProfile`'lari va ularning rivoji.
- **Bola (child-context)** — faqat o'z `session`/`event`; boshqa bola ma'lumotiga kira olmaydi.
- **Institut admin (B2B)** — faqat o'z institut brending/litsenziyasi → [[06-Modullar/Billing]].

## Ruxsatlar matritsasi

| Endpoint / amal | Ota-ona | Bola (child-ctx) | Institut admin | Platforma admin |
|---|:---:|:---:|:---:|:---:|
| `auth/me` | ✅ | ❌ | ✅ | ✅ |
| `auth/child-context` (PIN) | ✅ | — | ❌ | ❌ |
| `curriculum` / `lesson` o'qish | ✅ | ✅ (o'z darajasi) | ❌ | ✅ |
| `learning/session` · `learning/event` | ❌ | ✅ (o'zi) | ❌ | ❌ |
| Bola rivoji / mastery | ✅ (o'z bolasi) | ❌ | agregat | ✅ |
| Vaqt cheklovi / profil boshqaruv | ✅ | ❌ | ❌ | ✅ |
| Kontent (Admin) tahrir | ❌ | ❌ | ❌ | ✅ |
| `config` / brending sozlash | ❌ | ❌ | ✅ (o'zi) | ✅ |
| Xarid / subscription | ✅ (Parent Gate) | ❌ | ✅ | ✅ |

## 🗄️ PII minimallashtirish (Privacy)
> [!warning] Bola haqida minimal ma'lumot
> `ChildProfile` faqat: taxallus (ism shart emas) + avatar + yosh-diapazon + ona tili.
> Tug'ilgan sana o'rniga **age_band** afzal. Bolaga email/telefon **olinmaydi**.
> Bu COPPA/GDPR-K PII minimallashtirish talabiga mos.

## Media xavfsizligi (RBAC-proxy)
- MinIO/S3 bucket **private**; yuklash/yuklab olish **presigned URL** orqali.
- `/media/` → **Nginx RBAC-proxy**: faqat ruxsatli bola/ota-ona media URL oladi.
- Fayl turi/hajmi validatsiya (audio/rasm/lottie; max hajm) → [[06-Modullar/Media]].

## Transport va infratuzilma
- HTTPS majburiy (Nginx + TLS) → [[05-DevOps/Nginx-Konfiguratsiya]].
- Secret'lar `.env` / Docker secrets'da; repoga **kommit qilinmaydi**.
- CORS: faqat frontend domeni. Headerlar: HSTS, X-Frame-Options, CSP.

## Backup va tiklash
- PostgreSQL avtomatik zaxira (compose `backup` xizmati) + MinIO media zaxira.
- Batafsil strategiya → [[05-DevOps/Deploy]].

> [!success] Audio-birinchi + matnsiz = inklyuziv
> Yirik nishonlar, audio-asos, kam matn — qulaylik (accessibility) va bola uchun
> tasodifiy xavfsiz amallarni kamaytiradi (SPEC §7.5).
