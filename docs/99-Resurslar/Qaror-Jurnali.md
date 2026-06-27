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
| [[#ADR-009 — Faza 1 xavfsizlik qotirish va kechiktirilgan elementlar\|ADR-009]] | Auth xavfsizligi | ✅ qabul qilingan |
| [[#ADR-010 — Kontent kontrakti (confusable + config_json v2 + SRS)\|ADR-010]] | Kontent/SRS kontrakti | ✅ qabul qilingan |
| [[#ADR-011 — Faza 3 xavfsizlik review + public-media xulosasi\|ADR-011]] | Public media + media/API xavfsizligi | ✅ qabul qilingan |
| [[#ADR-012 — O'yin dvigateli: registry plugin + frontend distraktor\|ADR-012]] | Mexanika registry + §4.4 distraktor joyi | ✅ qabul qilingan |
| [[#ADR-013 — SRS dvigateli: izolyatsiyalangan scheduler + idempotent event + polimorfik ItemState\|ADR-013]] | SRS yadrosi (Faza 6) | ✅ qabul qilingan |
| [[#ADR-014 — Harf mexanikalari: acceptsItemTypes + schedule(dimension) + yumshoq tracing\|ADR-014]] | Trek A alifbo (Faza 7) | ✅ qabul qilingan |
| [[#ADR-015 — Geymifikatsiya: ichki-yo'naltirilgan + SRS'dan + ota-ona paneli\|ADR-015]] | Geymifikatsiya + ota-ona paneli (Faza 8) | ✅ qabul qilingan |

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

## ADR-009 — Faza 1 xavfsizlik qotirish va kechiktirilgan elementlar
- **Holat:** ✅ qabul qilingan (2026-06-27)
- **Kontekst:** Faza 1 auth tugagach, ko'p agentli **adversarial security review** (5 lens: izolyatsiya, token, PIN, maxfiylik, konfiguratsiya) o'tkazildi — 16 ta asoslangan topilma (26 false-positive rad etildi). Bolalar platformasi (COPPA/GDPR-K) uchun auth qatlami xavfsiz bo'lishi shart.
- **Qaror:** Arzon va Faza 1'ga mos topilmalar **darhol tuzatildi**: (1) PIN brute-force'ga qarshi `enter` throttle (`pin_entry` 5/min → 429); (2) Django parol validatorlari `validate_password` orqali ishga tushirildi (DRF avtomatik chaqirmaydi); (3) prod'da `SECRET_KEY` majburiy (dev default'iga tushmasin); (4) telefon normalizatsiyasi (`+998 90...` ≡ `+99890...`) — dublikat va Faza 2 SMS ziddiyatini oldini oladi; (5) PIN serverda aniq 4-raqam; (6) admin'da ota-ona telefon/email qidiruvi olib tashlandi (PII minimallashtirish); (7) register/profiles throttle.
- **Kechiktirildi (Faza 2+):** bola-kontekst tokenni API interceptorida ishlatish (Faza 6 — hali `learning` endpoint yo'q); JWT'ni `localStorage` o'rniga httpOnly cookie'da saqlash; refresh'da `active_child_id` claim'ni saqlash; parol tiklash / akkaunt recovery (SPEC bo'yicha keyingi faza); enter'dagi TOCTOU; PIN pattern (0000/1234) rad etish.
- **Oqibat:** Auth qatlami xavfsizlik-birinchi nuqtada git'ga muhrlandi. Kechiktirilgan elementlar tegishli fazada bajariladi. Qarang [[06-Modullar/Accounts#Xavfsizlik (review)]].

## ADR-010 — Kontent kontrakti (confusable + config_json v2 + SRS)
- **Holat:** ✅ qabul qilingan (2026-06-27, "Faza 2.5")
- **Kontekst:** Faza 2 kontent katalogi tahlilida 3 bo'shliq aniqlandi: (1) §4.4 semantik interferensiya (o'xshash so'z chalg'ituvchi bo'lmasin) modelda ifodalab bo'lmasdi; (2) `config_json` yassi (`{items, game_types}`) — so'z↔o'yin bog'lanishi va distractor manbai yo'q; (3) SRS dinamik so'zni statik config'ga qanday qo'shishi hujjatsiz edi. Bu — Faza 3 (API) dan **oldin** mustahkamlanishi kerak bo'lgan kontrakt (chunki API shu shaklni qaytaradi).
- **Qaror:**
  1. **`Word.confusable_with`** = `M2M('self', symmetrical=True)` — o'xshash so'zlar (demo: кошка↔коза). *Faqat ma'lumot; distractor TANLASH logikasi Faza 5'da.*
  2. **`config_json` v2:** `{new_items:[{type,id}], games:[{type,...params}]}` — tipli items (word|letter aralash bo'lishi mumkin), per-game parametr (`distractors.source`, `exclude_confusable`, `pair_mode`). `schema_json` deklarativ tavsif sifatida qoladi (validatsiya qo'shilmadi — hozir ortiqcha). `option_count` dvigatel tomonidan `schema_json` diapazonidan tanlanadi, config'da qotirilmaydi.
  3. **SRS kontrakti hujjatlandi** (SPEC §4.4, CLAUDE.md): `config = statik seed kontenti`; SRS due so'zlar runtime sessiya-navbati qatlamida `interleave` qilinadi, config'ga yozilmaydi.
  4. **`soz_qur` bo'g'in** bo'shlig'i Faza 7'ga hujjatlandi (kod yo'q) → [[06-Modullar/Kontent#Ma'lum bo'shliqlar (Known gaps)]].
- **Chegara:** Dvigatel/API/distractor-logikasi/bo'g'in YO'Q — faqat model + config shakli + hujjat. Migratsiya additiv (`content.0002`). 23 pytest yashil.
- **Oqibat:** Faza 3 API barqaror kontent kontraktiga tayanadi; Faza 5/6 (dvigatel, SRS) kengaytirilgan strukturaga tayyor. Qarang [[06-Modullar/Kontent]], [[06-Modullar/SRS-Learning]].

## ADR-011 — Faza 3 xavfsizlik review + public-media xulosasi
- **Holat:** ✅ qabul qilingan (2026-06-27)
- **Kontekst:** Faza 3 (media pipeline + kontent API) 3 yangi xavf yuzasi kiritdi: public media, bola-kontekst authz, age_band ruxsati. Commit'dan oldin ko'p-agentli adversarial review (28 agent, 4 lens) + live empirik probalar o'tkazildi.

### 🔑 Public-media XULOSASI: **QAROR XAVFSIZ** (non-sensitive o'quv kontenti uchun)
Empirik tasdiqlandi: bucket policy **faqat `s3:GetObject`** — anonim **GET→200, LIST→403, PUT→403, DELETE→403** (obyekt o'chmadi); `storage_key` **UUID4** (enumerable emas). Media — o'quv kontenti, **PII emas**.
→ **Download-proxy SHART EMAS.** Sabablar: (a) maxfiy emas; (b) proxy har media so'rovini Django'dan o'tkazib, bolalar ilovasidagi yuzlab audio/rasmni sekinlashtirardi; (c) CDN/keshlash public URL bilan tabiiy.
> [!warning] SHARTLAR (buzilmasin)
> - Bu bucket'ga **FAQAT o'quv media** (audio/rasm/lottie) tushadi — **PII/zaxira/log HECH QACHON**.
> - Kelajakda **premium/maxfiy** kontent bo'lsa — **o'shanda** signed URL (`AWS_QUERYSTRING_AUTH=True`) yoki RBAC-proxy qo'shiladi (hozir emas).

### ✅ Tuzatildi (real + arzon + faza-mos)
- **MIME confusion (SVG-XSS):** kengaytma-validator yetarli emas edi — endi rasm uchun **PIL KONTENT tekshiruvi** (SVG'ni `.png` nomi bilan yuklab bo'lmaydi). Live tasdiq: SVG-as-png → RAD.
- **Pillow decompression bomb (DoS):** `Image.MAX_IMAGE_PIXELS=40MP` (upload validator + task) + 25MB hajm cap.
- **Content endpoint throttle:** `curriculum`/`lesson` → `content` (240/min) defense-in-depth.

### ❌ Rad etildi (sabab bilan)
- **"age_band PATCH bilan o'zgaradi"** — xavf EMAS: ota-ona **O'Z** bolasini boshqaradi (cross-tenant bloklangan, kontent maxfiy emas, age'ni to'g'rilash qonuniy). `read_only` qilish qonuniy yangilanishni buzardi. Mahsulot qarori, security emas.
- **"Curriculum ETag mismatch"** — aslida TO'G'RI: ETag har-bola (`child.id`, javobda `child{}` bor), `levels` keshi age_band bo'yicha (bola-independent). Reviewer taklifi (ETag→age_band) **leak keltirardi** (B display_name → A). O'zgartirilmadi.

### ⏭️ Kechiktirildi (hujjatlangan)
- SECRET_KEY dev-default (prod allaqachon majburiy — ADR-009; dev `.env` beradi).
- `AGE_RANK` noma'lum qiymat (TextChoices + serializer choices cheklaydi).
- Unbounded `file.read()` (25MB upload cap + anonim PUT yo'q → mitigatsiya).
- To'liq rate-limit/WAF infra → Faza 10 (sayqal).
- **Oqibat:** Media/kontent qatlami xavfsizlik tasdig'i bilan git'ga muhrlandi; public-media qarori rasman tasdiqlandi. 32 pytest yashil. Qarang [[06-Modullar/Media]], [[02-Arxitektura/Xavfsizlik]].

---

## ADR-012 — O'yin dvigateli: registry plugin + frontend distraktor
**Holat:** ✅ qabul qilingan · Faza 5 · 2026-06-27

**Kontekst.** Faza 5 — data-driven o'yin dvigateli + 3 mexanika (Eshit va bos, Juftla, Topib ber).
SPEC §5'da 11 mexanika (Faza 5/7/9/11). §4.4 — distraktor (chalg'ituvchi) interferensiya: confusable
so'zlar yonma-yon chiqmasligi kerak. Ikki qaror talab qilindi.

**Qaror 1 — Mexanika = o'z-o'zini ro'yxatga oluvchi PLUGIN (registry).**
- `GamePlayer` ichida `if game_type == ...` YO'Q. Har mexanika alohida komponent →
  `registerMechanic(key, Component)` (`frontend/lib/games/registry.ts`).
- `GamePlayer` faqat kontrakt beradi: `MechanicProps { items, pool, spec, ageBand, onResult, onDone }`.
- **Yangi mexanika = komponent + `mechanics/index.ts`ga 1 qator.** Markaziy fayl o'zgarmaydi.
- **Sabab:** Faza 7 (harf_ovi, harf_chiz, qaysi_tovush, so'z_qur) va Faza 9 (sehrli_ertak, qo'shiq)
  markaziy `GamePlayer`ni shishirmasin — ular shunchaki yangi plugin bo'ladi (ochiq-yopiq prinsipi).

**Qaror 2 — Distraktor tanlash FRONTEND'da (§4.4).**
- `/lesson` javobi `confusable_ids` + mavzu so'zlarini allaqachon yetkazadi (Faza 3) → backend qo'shimcha
  so'rovsiz. `frontend/lib/games/distractors.buildOptions(target, pool, optionCount, excludeConfusable)`.
- **Manba** = mavzu so'zlari; `exclude_confusable: true` → `confusable_ids` distraktor bo'la olmaydi
  (кошка↔коза yonma-yon emas). `option_count` schema `[2,4]`dan **age_band** bo'yicha (3-4→2…). Graceful ≥2.
- **Sabab:** oddiyroq (server holatsiz), deterministik test qilsa bo'ladi; backend helper kerak emas.
  (Muqobil — backend helper — rad etilmadi, lekin hozir kerak emas; Faza 6 SRS bilan qayta ko'riladi.)

**Faza 6 kontrakti (ADR-010 davomi).** `buildSessionQueue(new, due=[])` + `recordResult(...)` (lokal outbox)
interfeyslari HOZIR qo'yildi → Faza 6 SRS due/event ulanishi `GamePlayer`ni o'zgartirmaydi.

**Oqibat.** 3 mexanika plugin sifatida ishlaydi; dars to'liq o'ynaladi (intro→practice→mastery→natija);
§4.4 distraktor va age_band option_count Playwright bilan tasdiqlandi (12/12). Qarang
[[06-Modullar/Oyin-Mexanikalari]], [[06-Modullar/SRS-Learning]].

---

## ADR-013 — SRS dvigateli: izolyatsiyalangan scheduler + idempotent event + polimorfik ItemState
**Holat:** ✅ qabul qilingan · Faza 6 · 2026-06-27

**Kontekst.** Faza 6 — ko'rinmas SRS yadrosi (SPEC §4). Uchta uzoq-muddatli qaror talab qilindi.

**Qaror 1 — `schedule()` IZOLYATSIYALANGAN, almashtiriladigan funksiya.**
- Model FSRS-TAYYOR maydonlarni saqlaydi (`stability, difficulty, due_at, last_reviewed_at, reps, lapses`).
- Interval mantig'i BITTA fayl: `apps/learning/scheduler.py::schedule(state, is_correct, latency)`.
- MVP: KONSERVATIV **SM-2-lite** (to'g'ri → 1,3,7,×2.2 kun; xato → ~10 daq, lapse++). Sabab: haqiqiy
  bola ma'lumotisiz to'liq FSRS parametrlarini sozlab bo'lmaydi.
- **Faza 10+:** sozlangan FSRS'ga almashtirish MODEL yoki EVENT yozuvni o'zgartirmaydi — faqat `schedule()` ichi.

**Qaror 2 — Event IDEMPOTENT (`event_id` UUID).**
- SRS holati event'lardan hisoblanadi. Offline outbox onlayn qaytganda bir xil eventni IKKI marta
  yuborishi mumkin → state buzilmasligi uchun `LearningEvent.event_id` (client-generated UUID, unique).
- `record_event`: event_id mavjud bo'lsa → IGNORE (state qayta o'zgarmaydi), 200 qaytadi.
- Frontend `recordResult`/`recordExposure` har eventga UUID + **outbox→sync** (POST muvaffaqiyatda
  o'chiradi; tarmoq uzilsa qoladi, `online`'da qayta yuboriladi). Faza 10 (to'liq offline) poydevori.

**Qaror 3 — ItemState POLIMORFIK + reseptiv/ekspressiv ajratilgan.**
- Yagona `ItemState` model: `item_type` (word|letter) + `item_id`. Letter Faza 7'da SHU modelni ishlatadi.
- `receptive_strength` / `expressive_strength` ALOHIDA (§4.3). Hozir faqat RESEPTIV haydaladi (Faza 5
  mexanikalari reseptiv); ekspressiv maydon BO'SH turadi, Faza 7/9 (so'z_qur, aytib_ber) to'ldiradi.

**Boshqa qarorlar.** (a) Progress REAL + LINEER: 1-mavzu ochiq, mavzu "done" (≥60% so'z
`receptive_strength≥0.5` — YUMSHOQ, bola qamalib qolmasin) → keyingisi ochiladi. Curriculum keshi
bola-independent struktura; progress per-bola overlay; ETag'ga progress-stamp (304 eskirmasin).
(b) Takrorlash (#11) — registry plugin (ADR-012), `/review` thin orkestrator, due itemlardan.
(c) `useSessionQueue`/`recordResult` interfeyslari ortini to'ldirish **GamePlayer'ni o'zgartirmadi**.

**Oqibat.** Bola so'z o'rgansa keyingi sessiyalarda kengayuvchi intervalda qaytadi; xato so'z tezroq.
Event idempotent (outbox dublikat state buzmaydi). pytest 45/45 (13 yangi), Playwright 14/14; Faza 5
testlari saqlandi. Qarang [[06-Modullar/SRS-Learning]], [[02-Arxitektura/SRS-Dvigateli]].

---

## ADR-014 — Harf mexanikalari: acceptsItemTypes + schedule(dimension) + yumshoq tracing
**Holat:** ✅ qabul qilingan · Faza 7 (Trek A) · 2026-06-27

**Kontekst.** Faza 7 — kirill alifbo/fonetika (SPEC §3 Trek A + §5 #4–7): harf_ovi, qaysi_tovush
(reseptiv), harf_chiz, so'z_qur (ekspressiv). Ekspressiv strength SHU yerda ishga tushadi.

**Qaror 1 — Navbat routing = mexanika-darajasida `acceptsItemTypes` (dars-tur filtri EMAS).**
- `get_due` aralash (word+letter) qaytaradi. Har mexanika registry'da QABUL qiladigan turlarini
  e'lon qiladi (`registerMechanic(key, Comp, accepts)`): eshit_va_bos→[word], harf_ovi/qaysi_tovush/
  harf_chiz→[letter], so'z_qur→[word], juftla/takrorlash→[word,letter]. Mexanika kirish itemlarini
  shunga filtrlaydi; `buildOptions` distraktorni TARGET TURI bilan bir xil tanlaydi.
- **Sabab:** takrorlash (#11) aralash navbatni "bepul" to'g'ri qiladi (har item o'z mexanikasiga);
  dars-tur filtridan toza; kelajakda juftla ikkala turni qabul qilsa — qayta yozish yo'q. Hook ichida
  qoladi → **GamePlayer O'ZGARMAYDI**.

**Qaror 2 — `schedule(state, correct, latency, dimension)` — ekspressiv ishga tushadi.**
- `GameType.dimension` (receptive|expressive) yangi maydon (data-driven, admin-editable). `record_event`
  game_type→dimension. `schedule()` interval (due_at/stability/reps) UMUMIY saqlaydi, faqat STRENGTH'ni
  dimension bo'yicha ajratadi (receptive_strength | expressive_strength). Izolyatsiya PARAMETR orqali —
  model/event o'zgarmaydi (ADR-013 saqlanadi). so'z_qur/harf_chiz → ekspressiv; harf_ovi/qaysi_tovush → reseptiv.

**Qaror 3 — harf_chiz YUMSHOQ baholash (§6.3, perfeksionizm yo'q).**
- Kontur kataklarining yetarli ulushi qoplansa qabul (`TRACE_COVERAGE_THRESHOLD` — bitta konstanta,
  qurilmada qo'lda sozlanadi). Touch-birlamchi + responsive (sichqoncha ham). Xato→qayta imkon, jazo yo'q.

**Qaror 4 — so'z_qur HARFLARDAN; murakkab harflar faqat RECORD.**
- so'z lemma'sidan harflar aralashtiriladi → tartibga solinadi (segmentatsiya yo'q). Bo'g'in keyin
  (seed'da QO'LDA, algoritmik bo'g'inlash YO'Q — rus qoidalari xato beradi). Murakkab harflar
  (ж,ц,ч,ш,щ,ы,ъ,ь) faqat Letter RECORD (so'z_qur uchun) — alohida drill keyin (§3 oson→qiyin).

**Boshqa.** ResolvedLetterSerializer'ga `confusable_ids: []` qo'shildi (uniform kontrakt — buildSessionQueue
harf darsida crash bo'lmasin); frontend `?? []` defensiv guard.

**Oqibat.** 4 mexanika registry plugin (GamePlayer o'zgarmadi); ekspressiv strength haydaladi; letterlar
SRS'ga kiradi (polimorfik) + takrorlashga. pytest 48/48 + Playwright 17/17; Faza 5/6 saqlandi.
Qarang [[06-Modullar/Oyin-Mexanikalari]], [[06-Modullar/SRS-Learning]].

---

## ADR-015 — Geymifikatsiya: ichki-yo'naltirilgan + SRS'dan + ota-ona paneli
**Holat:** ✅ qabul qilingan · Faza 8 · 2026-06-27

**Kontekst.** SPEC §6 (geymifikatsiya) + §8 (ota-ona paneli). Mukofot dunyosi: "O'RMONNI JONLANTIRISH".
SRS yetti faza boy ma'lumot to'pladi (mastery, qiyin itemlar) — endi ko'rinish + motivatsiya qatlami.

**Qaror 1 — ICHKI-YO'NALTIRILGAN (ball/liderboard/XP YO'Q, §6.3).** Mukofot = yig'iladigan dunyo
(o'rmonni jonlantirish) + Mishka customization + yutuq ("men yangi narsa bila olaman" hissi). Streak
bolaga AYBLOV emas (asosan ota-ona paneliga). Hammasi MAVJUD SRS'dan — `evaluate_rewards` IDEMPOTENT,
**lazy gamification GET'da** (learning/SRS/GamePlayer butunlay tegilmaydi). `rule_json` data-driven
(handler-map; registry shart emas — shartlar kam xil-xil).

**Qaror 2 — "yangi ochilgan" `seen` bayrog'i.** ChildAchievement/Element/MishkaItem `seen=False` →
forest GET "recent" qaytaradi va seen=True qiladi → natija ekrani "🌳 yangi do'st!"ni faqat haqiqatan
yangi ochilganga bir marta ko'rsatadi (qayta kirishda takrorlanmaydi).

**Qaror 3 — O'rmon "YAXSHIDAN AJOYIBGA".** Bo'sh emas — boshidanoq tirik (Mishka, daraxtlar); yutuq
BOYITADI (qo'shimcha bezaklar). Elementlar = ASSET slot (emoji placeholder, keyin sprite). Forest
xaritasi (Faza 4) + jonlangan o'rmon BIR dunyoda; bola zonasi devori saqlanadi.

**Qaror 4 — Vaqt: GAP-ASOSLI (SessionLog/heartbeat YO'Q).** `minutes_today` LearningEvent.ts'dan —
ketma-ket event'lar orasi `ACTIVE_GAP_SECONDS` (konstanta) dan kichik bo'lsa faol vaqtga qo'shiladi,
katta bo'lsa tanaffus (bir necha sessiyani to'g'ri ajratadi). To'liq analitika+heartbeat → Faza 10.

**Qaror 5 — Vaqt cheklovi YUMSHOQ.** `ChildProfile.daily_limit_minutes` (ota-ona o'rnatadi). Chegara
nuqtalarida (forest-kirish bildirgi + dars-boshi gate) tekshiriladi — o'rtada UZMAYDI; yetganda
"Mishka charchadi, ertaga" (jazo emas). Ota-ona paneli = `ChildProfileViewSet` @action `progress`
(parent JWT + Faza 3 egalik authz; alohida app YO'Q) — REAL SRS (mastery, mavzu, faollik, qiyin).

**Oqibat.** Bola yutuq/element ochadi (REAL SRS'dan), o'rmoni boyiydi; ota-ona REAL rivojni ko'radi;
vaqt yumshoq cheklanadi. learning/SRS/GamePlayer O'ZGARMADI. pytest 56/56, Playwright; Faza 5/6/7 saqlandi.
Qarang [[06-Modullar/Geymifikatsiya]], [[01-Loyiha/Foydalanuvchi-Rollari]].

**Adversarial review (commit oldidan, 4 o'lcham × tasdiqlash).** 19 topilma → tuzatildi:
(1) **HIGH XAVFSIZLIK** — bola-kontekst token ota-ona endpointlarini (daily_limit PATCH, progress) chaqira
olardi → `IsParentToken` permission (active_child_id'li token RAD; bola limitni uzaytira olmaydi);
(2) ForestView GET `seen`'ni o'zgartirardi (non-idempotent + race) → GET FAQAT O'QIYDI, alohida
`POST /forest/seen/` ack (ResultView chaqiradi); (3) ResultView forest GET event-sync'dan oldin ishlardi
("yangi do'st" o'tkazib yuborardi) → `flushOutbox` kutiladi + xarita invalidate; (4) `daily_limit=0`
"cheksiz" deb talqin qilinardi → `limit is not None` (0 = o'yin yo'q); + locale theme, 404 handling,
unused param. Qabul qilingan: streak write-on-read (zararsiz), audio overlap (yangi do'st ustun).

**Adversarial review (commit oldidan, 4 o'lcham × tasdiqlash).** 20 topilma → 3 tuzatildi:
(1) **MED** — aralash review'da yagona-tur target `buildOptions`'da TRIVIAL 1-variant berib SRS'ni soxta
"to'g'ri" bilan buzardi → cross-type oxirgi-chora fallback (doim ≥2 variant); (2) `useGameFeedback` timer
unmount'da tozalanadi; (3) `useSessionQueue` deps `due.length`→due-tarkib kaliti.
**Qabul qilingan (tuzatilmadi):** harf-due so'z darsiga to'qilsa tushib qoladi — `acceptsItemTypes`
DIZAYNI (harflar review/harf-darsida qaytadi); mexanika round-timer unmount — React 18'da zararsiz
(no-op); alifbo mavzusi "done" bo'lmasligi — kosmetik (oxirgi mavzu, bloklamaydi).

**Adversarial review (commit oldidan, 4 o'lcham × tasdiqlash).** 17 topilma → 3 tuzatildi:
(1) **bo'sh mavzu** (so'z yo'q) lineer zanjirni abadiy qulflar edi → bo'sh mavzu to'smaydi (regressiya testi);
(2) **konkurent dublikat** event_id → IntegrityError/500 → savepoint + IntegrityError ushlandi (idempotent 200);
(3) intro exposure `last_result`ni noto'g'ri "tuzatardi" → faqat retrieval'da yangilanadi.

**Adversarial review (commit'dan oldin, 4 o'lcham × tasdiqlash — Faza 1/3 uslubi).** 25 topilma →
5 tasdiqlandi va tuzatildi: (1) bo'sh `games[]` play-step → boshi-berk (GamePlayer skip effekti
kengaytirildi); (2) bo'sh navbat → mexanika qotib qoladi (markaziy guard + Juftla bo'sh-holat);
(3) "jazo yo'q" buzilgan edi — yulduz xato urinishlardan hisoblanardi → endi `firstTryWins/itemsDone`
(min 1 yulduz, doim ijobiy); (4) `buildOptions` ≥2 variant kafolati (kichik pool graceful);
(5) refetch'da navbat qayta aralashardi → `lesson.id` depKey + `staleTime`. Faza 6 kontraktini
mustahkamlash: **`useSessionQueue` hook** — due-ulanish bitta joyda, GamePlayer abadiy o'zgarmaydi.

---

> [!tip] Yangi ADR qo'shish
> Muhim, qaytarib bo'lmaydigan yoki keng ta'sirli qaror qabul qilsangiz:
> 1. Keyingi raqamni oling (ADR-009...), yuqoridagi jadvalga qator qo'shing.
> 2. **Holat / Kontekst / Qaror / Oqibat** sarlavhalari ostida yozing.
> 3. Tegishli hujjatlarga `[[wikilink]]` bering.
> 4. Eski qarorni almashtirsa — eskisini `eskirgan (ADR-N tomonidan)` deb belgilang, o'chirmang.
