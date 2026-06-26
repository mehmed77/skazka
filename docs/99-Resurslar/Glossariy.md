---
title: Glossariy — atamalar lug'ati
type: resurs
tags: [resurs, glossariy, lugat, meta]
status: aktiv
created: 2026-06-26
---

# 📖 Glossariy — Atamalar Lug'ati

> Bog'liq: [[SPEC|📜 To'liq Spetsifikatsiya]] · [[99-Resurslar/Havolalar|🔗 Havolalar]] · [[99-Resurslar/Qaror-Jurnali|🧾 Qaror Jurnali]] · [[00-Home|🏠 Bilim Markazi]]

> [!abstract] Bu nima
> SKAZKA loyihasida ishlatiladigan pedagogik, texnik va loyihaviy atamalarning yagona
> lug'ati. Har atama tegishli batafsil hujjatga `[[wikilink]]` orqali bog'langan. Yangi
> atama paydo bo'lsa — shu yerga qo'shib, manba hujjatga havola bering.

## 🧠 Pedagogik atamalar

| Atama | Ta'rif |
|---|---|
| **SRS** (Spaced Repetition System) | Kengayuvchi intervallarda takrorlash tizimi — so'zni xotirada mustahkamlash uchun "muddati kelganda" qayta ko'rsatish. SKAZKA'da **ko'rinmas** holda o'yin ichiga to'qiladi. Qarang: [[02-Arxitektura/SRS-Dvigateli|🧠 SRS Dvigateli]], [[06-Modullar/SRS-Learning]]. |
| **Leitner** | Quti-asosli SRS usuli: to'g'ri javob → keyingi quti (uzunroq interval), xato → 1-quti. MVP algoritmi. Qarang: [[02-Arxitektura/SRS-Dvigateli#Faza 6]]. |
| **FSRS** (Free Spaced Repetition Scheduler) | Ochiq, aniqroq SRS algoritmi — har so'z uchun `stability` + `difficulty` saqlaydi. SKAZKA 2-bosqichda **FSRS-lite** (soddalashtirilgan) ishlatadi. Qarang: [[02-Arxitektura/SRS-Dvigateli]]. |
| **TPR** (Total Physical Response) | J. Asher metodi: til jismoniy harakat bilan bog'lanib o'rganiladi; avval tushunish, keyin gapirish. Qarang: [[01-Loyiha/Pedagogik-Asos]]. |
| **TPRS** (TPR Storytelling) | B. Ray metodi: hikoyalar orqali o'rganish — **R**epetitive, **I**nteresting, **C**omprehensible, **H**igh-frequency. SKAZKA "Sehrli ertak" rejimi. Qarang: [[06-Modullar/Oyin-Mexanikalari]]. |
| **Comprehensible Input (i+1)** | S. Krashen tamoyili: bolaga joriy darajasidan **bir pog'ona yuqori** (i+1), lekin kontekst/rasm orqali tushunarli material berish. Qarang: [[01-Loyiha/Pedagogik-Asos]]. |
| **Dual Coding** | A. Paivio nazariyasi: so'z **+ tasvir** birga kodlanganda xotira kuchliroq. SKAZKA: har so'z = rasm + audio. Qarang: [[01-Loyiha/Pedagogik-Asos]]. |
| **Retrieval practice** | Aktiv eslab qolish (passiv qayta o'qish emas) — so'zni uzoq muddatli xotiraga o'tkazadigan eng samarali mexanizm. SRS yadrosining asosi. Qarang: [[02-Arxitektura/SRS-Dvigateli]]. |
| **Reseptiv** | Tanib olish darajasi: "Qaysi rasm — кошка?" (eshit → topish). Birinchi maqsad, 3–4 yosh uchun yagona. Qarang: [[01-Loyiha/Pedagogik-Asos]]. |
| **Ekspressiv** | Ishlab chiqarish darajasi: bola so'zni o'zi aytadi. 5+ yosh, reseptiv mustahkamlangach. Qarang: [[06-Modullar/SRS-Learning]]. |
| **age_band** | Yosh-diapazon belgisi (3–4 / 5–6 / 6–7) — kontent murakkabligi va mexanika shunga moslashadi. Qarang: [[01-Loyiha/Pedagogik-Asos]], [[02-Arxitektura/Malumotlar-Bazasi]]. |
| **cognate / kognat** | Ikki tilda o'xshash so'z (`stol`, `divan`, `mashina`, `park`). O'zbek bolalari uchun **tez g'alaba** — birinchi o'rgatiladi. Qarang: [[06-Modullar/Kontent]]. |

## ⚙️ Texnik va loyihaviy atamalar

| Atama | Ta'rif |
|---|---|
| **LearningEvent** | Har o'zaro ta'sirdan yoziladigan yozuv: `child_id, item_type, item_id, game_type, is_correct, latency_ms, hint_used, session_id, ts`. SRSni boshqaradi + analitika beradi. Qarang: [[02-Arxitektura/Malumotlar-Bazasi]], [[06-Modullar/SRS-Learning]]. |
| **GameType** | O'yin mexanikalari katalogi (`key, skill, min_age_band, schema_json`). Dars so'zlarini mexanikaga "quyadi". Qarang: [[06-Modullar/Oyin-Mexanikalari]]. |
| **Mishka** (🐻) | Loyiha maskoti — ayiqcha. Bola bilan "do'st", tanishtiradi, rag'batlantiradi, navigatsiyani boshqaradi. Qarang: [[06-Modullar/Geymifikatsiya]], [[06-Modullar/Dizayn-Tizimi]]. |
| **walled garden** (devor bilan o'ralgan bog') | Bola rejimi printsipi: chat yo'q, reklama yo'q, tashqi havola yo'q, ochiq internet yo'q. COPPA/GDPR-K ruhi. Qarang: [[02-Arxitektura/Xavfsizlik]]. |
| **Parent Gate** (ota-ona darvozasi) | Sozlama/xaridga kirishdan oldin kattalar tekshiruvi (matematik misol / uzoq bosib turish) — bola tasodifan kira olmasin. Qarang: [[02-Arxitektura/Xavfsizlik]], [[06-Modullar/Accounts]]. |
| **PWA** (Progressive Web App) | O'rnatiladigan + offline ishlaydigan veb-ilova. O'zbekistonda beqaror internet uchun **offline-birinchi dars pleyeri** muhim. Qarang: [[02-Arxitektura/Texnologiyalar-Steki]], [[06-Modullar/Dizayn-Tizimi]]. |
| **MinIO** | S3-mos object storage — dev muhitda media (audio/rasm) saqlash; prodda S3. Qarang: [[06-Modullar/Media]], [[05-DevOps/Docker-Setup]]. |
| **Celery** | Asinxron vazifa navbati (worker + beat, broker = Redis): audio ishlov, SRS ommaviy qayta hisob, bildirishnoma, kunlik agregat. Qarang: [[02-Arxitektura/Tizim-Arxitekturasi]], [[06-Modullar/Media]]. |
| **MOC** (Map of Content) | Obsidian'da boshqa notalarga yo'naltiruvchi "xarita" nota. Bizning bosh xarita — [[00-Home]]. |
| **ADR** (Architecture Decision Record) | Muhim qarorni "Holat / Kontekst / Qaror / Oqibat" formatida hujjatlashtirish. Qarang: [[99-Resurslar/Qaror-Jurnali]]. |

> [!tip] Atama qo'shish
> Yangi atama ishlatsangiz — shu jadvalga qo'shing, qisqa ta'rif bering va manba
> hujjatga `[[wikilink]]` qo'ying. Lug'at — vault bo'ylab yagona tushuncha manbai.
