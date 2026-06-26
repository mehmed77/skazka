---
title: Qarorlar jurnali (ADR)
type: resurs
tags: [resurs, adr, qaror, meta, prioritet/high]
status: aktiv
created: 2026-06-26
---

# 🧾 Qarorlar Jurnali (ADR)

> Bog'liq: [[SPEC|📜 To'liq Spetsifikatsiya]] · [[02-Arxitektura/Texnologiyalar-Steki|🧱 Texnologiyalar Steki]] · [[99-Resurslar/Glossariy#ADR|📖 Glossariy: ADR]] · [[00-Home|🏠 Bilim Markazi]]

> [!abstract] Bu nima
> **ADR** (Architecture Decision Record) — loyihaning muhim qarorlarini **Holat /
> Kontekst / Qaror / Oqibat** formatida hujjatlashtirish. Maqsad: nima uchun shunday
> qilinganini kelajakda eslab qolish, takror muhokamani kamaytirish. Har qaror — atomik
> va o'zgarmas (yangi qaror eskini bekor qilsa, yangi ADR yoziladi, eskisi `eskirgan`).

| ADR | Mavzu | Holat |
|---|---|---|
| [[#ADR-001 — Maqola konvensiyalariga amal qilish\|ADR-001]] | Vault konvensiyalari (Maqola) | ✅ qabul qilingan |
| [[#ADR-002 — Backend Django + DRF\|ADR-002]] | Backend stegi | ✅ qabul qilingan |
| [[#ADR-003 — Frontend Next.js + PWA\|ADR-003]] | Frontend stegi | ✅ qabul qilingan |
| [[#ADR-004 — SRS Leitner → FSRS-lite\|ADR-004]] | SRS algoritmi | ✅ qabul qilingan |
| [[#ADR-005 — Media MinIO / S3\|ADR-005]] | Media saqlash | ✅ qabul qilingan |
| [[#ADR-006 — Skeleton standart User → Faza 1 custom\|ADR-006]] | Auth model | ✅ qabul qilingan |
| [[#ADR-007 — Til o'zbekcha (i18n keyin)\|ADR-007]] | Hujjat/UI tili | ✅ qabul qilingan |
| [[#ADR-008 — Ruscha alohida git repo\|ADR-008]] | Repo ajratish | ✅ qabul qilingan |

---

## ADR-001 — Maqola konvensiyalariga amal qilish
- **Holat:** ✅ qabul qilingan (2026-06-26)
- **Kontekst:** Mavjud Maqola Obsidian vaultida sinalgan konvensiyalar (YAML frontmatter, emoji-H1, `> Bog'liq:`, papka-to'liq wikilink, callout, mermaid) bor. Yangi standart o'ylab topish vaqt sarflaydi va izchillikni buzadi.
- **Qaror:** SKAZKA vaulti **Maqola konvensiyalarini aynan** ko'chiradi — bir xil frontmatter sxemasi, emoji prefikslar, callout turlari, FOLDER-QUALIFIED wikilinklar va ~40–90 qatorli fokuslangan notalar.
- **Oqibat:** Yagona, tanish ko'rinish; oson ko'chirish. ➖ Maqola o'zgarsa, ikkala vault sinxron yuritilishi kerak.

## ADR-002 — Backend Django + DRF
- **Holat:** ✅ qabul qilingan (SPEC §9.2)
- **Kontekst:** B2B brending, kontent-admin, SRS qayta hisob, asinxron media ishlov kerak. TALIM loyihasidan Django+DRF tajribasi mavjud.
- **Qaror:** Backend = **Django + Django REST Framework**, JWT (SimpleJWT) auth, PostgreSQL, Redis kesh+broker, **Celery** (worker+beat), Django Admin (MVP kontent boshqaruvi). Bounded-context applar: `common, accounts, content, learning, gamification, media, billing`.
- **Oqibat:** Tez admin, yetuk ekotizim, TALIM naqshlarini qayta ishlatish. Qarang [[02-Arxitektura/Tizim-Arxitekturasi]], [[06-Modullar/Accounts]].

## ADR-003 — Frontend Next.js + PWA
- **Holat:** ✅ qabul qilingan (SPEC §9.3)
- **Kontekst:** Bola o'qiy olmaydi → audio-birinchi, animatsion, ulkan teginish UI kerak. O'zbekistonda internet beqaror → offline shart. Native ilova ortiqcha xarajat.
- **Qaror:** Frontend = **Next.js (App Router) + TypeScript + PWA** (o'rnatiladigan + offline). Holat: Zustand + TanStack Query. Audio: Web Audio API. Animatsiya: Framer Motion. Yozuv: Canvas. Service Worker — outbox pattern bilan sync.
- **Oqibat:** Bitta kod bazasi → veb + o'rnatiladigan. Offline dars pleyeri. Qarang [[06-Modullar/Dizayn-Tizimi]].

## ADR-004 — SRS Leitner → FSRS-lite
- **Holat:** ✅ qabul qilingan (SPEC §4.2)
- **Kontekst:** Bolaga moslashtirilgan ko'rinmas takrorlash yadrosi kerak. To'liq FSRS murakkab — MVPda haddan ortiq.
- **Qaror:** **1-bosqich:** Leitner qutilari (1/3/7/14/30 kun → mastered) — oddiy, MVP. **2-bosqich (Faza 6'dan keyin):** `FSRS-lite` — `stability` + `difficulty` saqlash, interval = `f(stability, difficulty, natija, latency)`.
- **Oqibat:** Tez ishga tushadi, keyin sifat oshadi. Migratsiya bosqichi rejalashtirilishi kerak. Qarang [[02-Arxitektura/SRS-Dvigateli]], [[06-Modullar/SRS-Learning]].

## ADR-005 — Media MinIO / S3
- **Holat:** ✅ qabul qilingan (SPEC §9.2)
- **Kontekst:** Har so'z/harf/ko'rsatma uchun audio + rasm. Hajm katta o'sadi; dev va prod muhitlar bir xil API talab qiladi.
- **Qaror:** S3-mos object storage — **dev: MinIO**, **prod: S3** (CDN orqali tarqatish). `Media` modeli `storage_key` saqlaydi; Celery transcode/normalize qiladi.
- **Oqibat:** Dev/prod paritet, arzon dev. MinIO `docker-compose`'da xizmat sifatida. Qarang [[06-Modullar/Media]], [[05-DevOps/Docker-Setup]].

## ADR-006 — Skeleton standart User → Faza 1 custom
- **Holat:** ✅ qabul qilingan
- **Kontekst:** Faza 0 skeletoni modelsiz. Lekin domen modeli **ParentAccount → ChildProfile** (bolaga login yo'q), bu Django standart `User` bilan to'g'ridan-to'g'ri mos kelmaydi. `AUTH_USER_MODEL`ni keyin almashtirish to'la migratsiyada og'riqli.
- **Qaror:** Faza 0 — **standart `User`** (skeleton, biznes-logikasiz). **Faza 1** — `accounts`ga `ParentAccount`/`ChildProfile` + **custom `AUTH_USER_MODEL`** qo'shiladi, **toza DB** ustida (eski migratsiya tarixi yo'q).
- **Oqibat:** Faza 0 tez ko'tariladi; Faza 1'da auth modeli toza joriy etiladi. ➖ Faza 1'gacha DB qayta yaratiladi (ma'lumot yo'qotilmaydi — hali demo). Qarang [[06-Modullar/Accounts]], [[03-Reja/Bosqichlar#Faza 1]].

## ADR-007 — Til o'zbekcha (i18n keyin)
- **Holat:** ✅ qabul qilingan
- **Kontekst:** Birlamchi jamoa va auditoriya o'zbek tilida. Erta i18n infratuzilmasi sekinlashtiradi.
- **Qaror:** Hujjatlar va boshlang'ich UI — **o'zbek (lotin)**. Kontent — rus (maqsad) + o'zbek (L1 scaffolding). To'liq **i18n keyinroq** (UI: uz+ru; arxitektura boshqa L1'larni B2B uchun qo'llasin).
- **Oqibat:** Tez yetkazib berish; lekin matnlar boshidan i18n-tayyor (hardcode emas) bo'lishi tavsiya etiladi. Qarang [[01-Loyiha/Maqsad-va-Vizyon]].

## ADR-008 — Ruscha alohida git repo
- **Holat:** ✅ qabul qilingan
- **Kontekst:** Bu loyiha (ruscha/SKAZKA) `online-judge` repozitoriyasi ichida boshlangan edi, ammo butunlay boshqa mahsulot.
- **Qaror:** SKAZKA **alohida git repozitoriya** sifatida `online-judge`'dan ajratiladi — mustaqil tarix, CI, deploy.
- **Oqibat:** Toza chegara, mustaqil versiyalash. ➖ Umumiy yordamchi kodni ikki repo o'rtasida ulashish bo'lsa, alohida paketga chiqarish kerak bo'lishi mumkin. Qarang [[05-DevOps/CI-CD]].

---

> [!tip] Yangi ADR qo'shish
> Muhim, qaytarib bo'lmaydigan yoki keng ta'sirli qaror qabul qilsangiz:
> 1. Keyingi raqamni oling (ADR-009...), yuqoridagi jadvalga qator qo'shing.
> 2. **Holat / Kontekst / Qaror / Oqibat** sarlavhalari ostida yozing.
> 3. Tegishli hujjatlarga `[[wikilink]]` bering.
> 4. Eski qarorni almashtirsa — eskisini `eskirgan (ADR-N tomonidan)` deb belgilang, o'chirmang.
