# SKAZKA — Bolalar uchun Rus Tili O'rganish Platformasi
### To'liq Loyiha Spetsifikatsiyasi (PRD + Arxitektura + Bosqichma-bosqich Cursor promtlari)

> **Ishchi nomi:** SKAZKA (Сказка — "ertak"). Maskot/yo'lboshchi qahramon: **Mishka** (Мишка — ayiqcha).
> Nomni keyin oson o'zgartirasiz — brending konfiguratsiya orqali boshqariladi (TALIM'dagi `/api/config/` yondashuvingiz kabi).
>
> **Maqsadli auditoriya:** 3–7 yoshli bolalar (ona tili o'zbekcha), rus tilini noldan, o'yin orqali, professional metodika bilan o'rganadi.
> **Stack:** Backend — Django + Django REST Framework; Frontend — Next.js (App Router) + TypeScript (PWA); Baza — PostgreSQL; Redis + Celery; Docker Compose.
> **Hujjat maqsadi:** Cursor + Claude Code uchun yagona haqiqat manbai (single source of truth). Repozitoriyga `docs/SPEC.md` sifatida joylanadi, har bosqich promti shu hujjatga tayanadi.

---

## 0. Bu hujjatdan qanday foydalanish kerak

1. Yangi repo oching, ushbu faylni `docs/SPEC.md` sifatida joylang.
2. Cursor'da loyihani oching, Claude Code'ga avval shuni ayting:
   > *"`docs/SPEC.md` — bu loyihaning to'liq spetsifikatsiyasi. Uni o'qib chiq va har bir bosqichda shunga amal qil. Hozir 0-bosqichdan boshlaymiz."*
3. Keyin §12 dagi promtlarni **ketma-ket**, bittadan yuboring. Har bosqich tugagach, "qabul mezonlari"ni (acceptance criteria) tekshirib, keyingisiga o'ting.
4. Har promtdan keyin Claude Code'ga: *"`docs/SPEC.md` dagi tegishli bo'limga muvofiq ishladingmi? Chetga chiqqan joylaringni ayt."* deb tekshiring.

---

## 1. Mahsulot tasavvuri (Product Vision)

**Muammo.** 3–7 yoshli bolalar uchun rus tilini o'rgatadigan tizimlarning aksariyati yo (a) kattalar ilovasidan moslashtirilgan va bolalar uchun og'ir, yo (b) o'yin ko'p, lekin ilmiy metodikasi yo'q — bola o'ynaydi-yu, so'z yodlamaydi.

**Yechim.** Pedagogik jihatdan isbotlangan metodlarni (TPR, comprehensible input, dual coding, interval takrorlash/retrieval practice) bolalar sevadigan o'yin qobig'iga "ko'rinmas" tarzda joylash. Bola o'ynayotganini his qiladi — aslida tizim uning xotirasini ilmiy jadval bo'yicha mustahkamlaydi.

**Asosiy farqlovchi xususiyat (differentiator).** *Ko'rinmas so'z-yodlash dvigateli* (§4): har bir o'rganilgan so'z bolaning xotira holatiga qarab, kerakli vaqtda, keyingi o'ynaydigan o'yinining ichida qayta paydo bo'ladi. Bu — alohida "takrorlash" sessiyasi emas, o'yinning bir qismi.

**Mahsulot tamoyillari:**
- **Audio-birinchi (audio-first):** Bola o'qiy olmaydi. Har bir ekran ovoz bilan tushuntiriladi. Matnga tayanmaydi.
- **O'yin = o'rganish:** Har bir mexanika aniq bir ko'nikma + xotira mexanizmiga bog'langan (bekorga "qiziqarli" emas).
- **Stresssiz:** Yutqazish, jazo, taymerlar yo'q (kichiklar uchun). Xato → yumshoq qayta urinish + maslahat.
- **Xavfsiz bog' (walled garden):** Reklama yo'q, chat yo'q, tashqi havola yo'q, ochiq internet yo'q.
- **Ota-ona — sherik:** Ota-ona paneli orqali bolaning rivojini ko'radi, vaqtni boshqaradi.
- **Qayta sotiladigan (B2B-ready):** Bir platforma — ko'p brending. Bog'cha/markazlarga litsenziya bilan sotish mumkin (TALIM'dagi `ModuleLicense` g'oyasi).

---

## 2. Pedagogik asos (loyihaning ilmiy yadrosi)

Bu bo'lim — UI emas, **metodika**. Dizayn va kod shu tamoyillarga xizmat qiladi. Quyidagilar zamonaviy ikkinchi til o'rgatish (SLA) tadqiqotlariga asoslangan.

### 2.1. Total Physical Response (TPR) — James Asher
Til chaqaloq ona tilini o'rgangandek o'rganiladi: **avval tushunish (listening), keyin gapirish**. So'z **jismoniy harakat** bilan bog'lansa, xotirada mustahkamroq qoladi va stress kamayadi. Bola gapirishga majbur qilinmaydi — u harakat/teginish orqali tushunganini ko'rsatadi.
- **Loyihada:** "Покажи кошку!" (mushukni ko'rsat!) — bola ekranda mushukni topib bosadi. So'z + harakat + rasm + ovoz birlashadi. 7 yoshgacha eng samarali davr.

### 2.2. Comprehensible Input (i+1) — Stephen Krashen
Til **tushunarli kirish** orqali o'zlashtiriladi: bolaga hozirgi darajasidan **bir pog'ona yuqori** (i+1) material beriladi, lekin kontekst/rasm orqali tushunarli bo'ladi. Past tashvish (low anxiety) muhit shart.
- **Loyihada:** Har bir yangi so'z doim rasm/ovoz/kontekst bilan beriladi — hech qachon "quruq" tarjima emas.

### 2.3. TPR Storytelling (TPRS) — Blaine Ray
Hikoyalar orqali o'rganish. Til **RICH** bo'lishi kerak: **R**epetitive (takroriy), **I**nteresting (qiziqarli), **C**omprehensible (tushunarli), **H**igh-frequency (yuqori chastotali so'zlar). Hikoya: muammo bor → qahramon yechim izlaydi → muammo hal bo'ladi.
- **Loyihada:** "Sehrli ertak" rejimi — o'rganilgan so'zlardan tuzilgan, tanlovli (choose-your-path) qisqa interaktiv ertaklar.

### 2.4. Dual Coding Theory — Allan Paivio
Xotira **so'z + tasvir** birga kodlanganda kuchliroq. Og'zaki va vizual kanal alohida ishlaydi, ikkisi birga — ikki barobar mustahkam iz.
- **Loyihada:** Har bir so'z = **rasm + ona tilidagi audio** (keyinroq + matn). Hech qachon faqat matn emas.

### 2.5. Retrieval Practice + Spaced Repetition (so'z-yodlash yadrosi)
Eng muhim ilmiy xulosa: **passiv qayta o'qish emas, aktiv eslab qolish (retrieval)** so'zni uzoq muddatli xotiraga o'tkazadi. Va bu **kengayuvchi intervallarda** takrorlansa eng samarali. Bu **4–5 yoshli bolalarda ham isbotlangan** (NIH tadqiqotlari: bolalar bir hafta o'tib so'zni xuddi 5 daqiqa o'tgandagidek aniq esladi).
- **Loyihada:** §4 — "ko'rinmas SRS dvigateli". Retrieval o'yin ichida sodir bo'ladi (kartochka emas). Intervallar bolaning natijasiga qarab moslashadi.
- **Diqqat:** *Semantik interferensiya* — bir-biriga o'xshash so'zlarni (mishka/mushka) bir vaqtda o'rgatmaslik kerak.

### 2.6. Ko'p sezgili (multisensory) + Musiqa
Bu yosh uchun **musiqa o'rganishning markaziy qismi** (tadqiqotlar: qo'shiqlar so'z yodlashni sezilarli oshiradi). Teginish, harakat, ranglar, tovush — barchasi xotirani mustahkamlaydi.
- **Loyihada:** Qo'shiq rejimi, harf chizish (tracing, Canvas), teginish-asosli o'yinlar.

### 2.7. Mukofot va xotira (neuro-asos)
Tadqiqotlar (Ripollés va b.): **mukofot signali so'z o'rganishni** miya darajasida kuchaytiradi. Lekin (§6 ogohlantirish) — haddan ortiq tashqi mukofot ichki motivatsiyani siqib chiqaradi.

### 2.8. Daraja-tabaqalashtirilgan yondashuv (3–4 vs 5–7)
| Yosh | Diqqat muddati | Yondashuv |
|---|---|---|
| **3–4** | ~3–5 daqiqa | Sof o'rganish/eksploratsiya. Minimal mexanika. Reseptiv (tanish: "qaysi rasm?"). Ko'p qaytariq. |
| **5–6** | ~5–8 daqiqa | Yengil maqsadlar, kolleksiyalar. Harflar boshlanadi. Reseptiv + ekspressiv boshlanishi. |
| **6–7** | ~8–12 daqiqa | Bo'g'in/so'z qurish, oddiy ertaklar, fonetika, yozish (tracing). |

---

## 3. Kontent arxitekturasi va kurikulum

Ikkita **bir-biriga bog'langan trek** parallel boradi:

### Trek A — Alifbo va Fonetika (kirill savodxonligi)
Rus tilining **katta afzalligi:** u **fonetik** — bir harf ≈ bir tovush, so'z qanday yozilsa, shunday o'qiladi (ingliz tilidan farqli). Bu bolalar uchun juda qulay.
- **33 harf:** 10 unli (5 qattiq: а,э,ы,о,у / 5 yumshoq: я,е,и,ё,ю), 21 undosh, 2 maxsus belgi (ъ qattiqlik, ь yumshoqlik — o'zbek/ingliz tilida yo'q tushuncha).
- **Guruhlash (oson → qiyin):**
  1. **Tanish ko'rinish/tovush:** А, О, К, М, Т, С, Н, И (lotin/o'zbekka yaqin)
  2. **Yangi shakl, oddiy tovush:** Б, В, Г, Д, Е, Л, П, Р, У, Я
  3. **Qiyinroq:** Ж, Ц, Ч, Ш, Щ, Х, З, Й, Ё, Ю, Ф, Э
  4. **Maxsus/qiyin:** Ы, Ъ, Ь
- **Metodika:** Har harf uchun — **mnemonik tasvir** (harf shakli biror narsaga o'xshatiladi), **tovush audio**, **harf chizish** (tracing), **so'z ichida topish**. Bu — an'anaviy *bukvar/azbuka* + *kassa bukv i slogov* (harf-bo'g'in yig'ish) g'oyasining raqamli ko'rinishi.

### Trek B — So'z boyligi (tematik birliklar)
Audio-birinchi, rasm-asosli, TPR ishoralari bilan. Mavzular (har biri ~10–20 so'z):

`Oila` · `Hayvonlar (uy)` · `Hayvonlar (yovvoyi)` · `Ranglar` · `Sonlar 1–10` · `Tana a'zolari` · `O'yinchoqlar` · `Kiyimlar` · `Mevalar/Sabzavotlar` · `Ovqat` · `Uy/Mebel` · `Transport` · `Tabiat/Ob-havo` · `Harakatlar (fe'llar)` · `Salomlashish/Odob`

> **O'zbek bolalari uchun bonus:** O'zbek tilida rus tilidan o'zlashgan so'zlar ko'p (`stol`, `divan`, `mashina`, `park`, `avtobus`...). Bularni **birinchi** o'rgatish — tez g'alaba va motivatsiya beradi (kognat-asosli yo'l).

### Kontent ierarxiyasi
```
Language (target=ru, scaffolding L1=uz)
  └─ Level (1, 2, 3...)              ← umumiy daraja
       └─ Unit / Theme (mavzu)        ← masalan "Hayvonlar"
            └─ Lesson (dars)          ← 1 o'tirishlik (~5–10 daq)
                 └─ LessonStep        ← Intro → Practice → Mastery
```

### Dars mikro-tuzilishi (har darsda)
Tadqiqotdagi isbotlangan 3-modulli naqsh:
1. **Tanishtirish (Intro / pre-learning):** Yangi so'z/harf — rasm + ona tilidagi audio + ishora. Mishka tanishtiradi. (Reseptiv kirish, i+1.)
2. **Mashq (Practice / interactive drills):** 2–4 ta mini-o'yin (§5) — so'zlarni aktiv eslab qolish (retrieval). Bu yerda SRS dvigateli ishlaydi.
3. **Tekshirish (Mastery check):** Adaptiv mini-tekshiruv — bola so'zlarni o'zlashtirdimi? Natija → SRS holatini yangilaydi + mukofot.

---

## 4. So'z-yodlash dvigateli (ko'rinmas SRS) — yadro tizim

Bu — platformaning **eng muhim va eng murakkab** qismi. Kattalardagi flashcard (Anki) emas — bolaga moslashtirilgan.

### 4.1. Asosiy g'oya
Har bir bola × har bir so'z (yoki harf) uchun **xotira holati** saqlanadi. Bola so'zni o'yin ichida har "uchratganda", natija (to'g'ri/xato + javob tezligi) yoziladi va so'zning **keyingi takror vaqti** qayta hisoblanadi. So'z "muddati kelganda" — keyingi o'ynaydigan o'yiniga **ko'rinmas tarzda** qo'shiladi.

### 4.2. Algoritm (boshlang'ich: Leitner + FSRS-lite)
**1-bosqich (oddiy, MVP) — Leitner qutilari (kengayuvchi intervallar):**
```
Quti 1 → 1 kun       Quti 4 → 14 kun
Quti 2 → 3 kun       Quti 5 → 30 kun
Quti 3 → 7 kun       Quti 6 → o'zlashtirildi (mastered)
```
- To'g'ri javob → keyingi qutiga ko'tariladi.
- Xato → 1-qutiga tushadi (lekin yumshoq, jazo emas).
- "due_at <= now" bo'lgan so'zlar — keyingi o'yinga ustuvor kiritiladi.

**2-bosqich (keyinroq, aniqroq) — FSRS-lite:** Har so'z uchun `stability` (xotira mustahkamligi) va `difficulty` saqlanadi, interval =
`f(stability, difficulty, oxirgi_natija, javob_tezligi)`. FSRS ochiq algoritmidan ilhomlangan, lekin soddalashtirilgan. Bu bosqichni MVPdan keyin qo'shasiz.

### 4.3. Reseptiv → Ekspressiv mastery (ikki bosqichli)
Har so'z uchun **ikki xil o'zlashtirish** kuzatiladi:
- **Reseptiv (tanish):** "Qaysi rasm — кошка?" (eshit → rasmni top). Birinchi maqsad.
- **Ekspressiv (ishlab chiqarish):** Bola so'zni o'zi aytadi (keyingi faza, ovoz tanish bilan).
> 3–4 yosh: faqat reseptiv. 5+ yosh: reseptiv mustahkam bo'lgach, ekspressiv boshlanadi.

### 4.4. Retrievalni o'yinga "to'qish" (weaving) — kalit mexanika
```
Bola darsni/o'yinni boshlaganda:
  due_words = SRS.get_due(child, limit=N)        # muddati kelgan so'zlar
  new_words = curriculum.get_next_new(child, M)  # yangi so'zlar
  game_queue = interleave(due_words, new_words)  # aralashtirish
                # semantik interferensiyani oldini olib (o'xshash so'zlar yonma-yon emas)
  → har so'z mos keladigan o'yin mexanikasida ko'rsatiladi
  → har javob → LearningEvent yoziladi → SRS yangilanadi
```

> **Kontent kontrakti (Faza 2.5 qarori — ADR-010):**
> - `LessonStep.config_json.new_items` = darsning **STATIK** yangi kontenti (seed'da qotgan, o'zgarmas).
> - SRS "muddati kelgan" so'zlar `config_json`'ga **YOZILMAYDI** — ular runtime'da,
>   **sessiya-navbati qatlamida** qo'shiladi:
>   `get_session_queue(child, step) = interleave(SRS.get_due(child), resolve(step.new_items))`
> - Distractor (chalg'ituvchi) tanlashda `Word.confusable_with` **chiqarib tashlanadi**
>   (`config_json.games[].distractors.exclude_confusable=true`) — semantik interferensiyani oldini olish.
> - Ya'ni: **config = o'zgarmas seed kontenti; sessiya-navbati = dinamik qatlam** (Faza 6).

### 4.5. Har o'zaro ta'sirdan yoziladigan ma'lumot (`LearningEvent`)
`child_id, item_type (word/letter), item_id, game_type, is_correct, latency_ms, hint_used, session_id, timestamp` — bu ham SRSni boshqaradi, ham analitika beradi.

---

## 5. O'yin mexanikalari (har biri ko'nikma + retrievalga bog'langan)

Har mexanika — **GameType** katalogida. Dars o'z so'zlarini shu mexanikalarga "quyadi".

| # | O'yin (uz / ru) | Ko'nikma | Retrieval turi | Yosh |
|---|---|---|---|---|
| 1 | **Eshit va bos** / «Слушай и нажми» | So'z ↔ rasm (reseptiv) | Tanib olish | 3+ |
| 2 | **Juftla** / «Найди пару» (memory) | Rasm↔audio / rasm↔rasm | Xotira + tanib olish | 3+ |
| 3 | **Topib ber** / «Покажи …» (TPR) | Sahnada so'zni topish | Kontekstli tanib olish | 3+ |
| 4 | **Harf ovi** / «Где буква?» | Harfni tanish/topish | Harf tanib olish | 5+ |
| 5 | **Harf chiz** / «Обведи букву» (tracing) | Harf yozish (motor) | Ishlab chiqarish (motor) | 5+ |
| 6 | **Qaysi tovush?** / «Какой звук?» | Tovush → harf (fonetika) | Fonematik | 5+ |
| 7 | **Bo'g'in/So'z qur** / «Собери слово» | Bo'g'in/harflardan so'z | Ishlab chiqarish | 6+ |
| 8 | **Sehrli ertak** / «Сказка» (TPRS) | So'zlar kontekstda | Kontekstli, tanlovli | 5+ |
| 9 | **Qo'shiq** / «Песенка» | So'z + musiqa + harakat | Ko'p sezgili | 3+ |
| 10 | **Aytib ber** / «Скажи!» (ASR, keyingi faza) | So'zni aytish | Ekspressiv (ovozli) | 5+ |
| 11 | **Takrorlash o'yini** / «Повторюшка» (boss) | Aralash, muddati kelgan so'zlar | Aralash retrieval | 4+ |

**Umumiy qoidalar:**
- Har to'g'ri javobda — Mishka quvonadi, konfetti, yoqimli tovush (darhol, bo'rttirilgan ijobiy feedback — Duolingo uslubi).
- Xatoda — jazo yo'q. Mishka "qayta urinaylik" deydi, maslahat (rasm yiriklashadi / audio qayta yangraydi), so'ng qayta imkon.
- **Kichiklar uchun (3–4):** ekranda 2 ta tanlov, taymer yo'q.
- Har mexanika **kontentdan mustaqil** (data-driven): yangi so'z qo'shilsa, hamma o'yin avtomatik ishlaydi.

---

## 6. Geymifikatsiya va motivatsiya (muvozanatli)

> **Muhim ilmiy ogohlantirish (tadqiqotdan):** Haddan ortiq tashqi mukofot (ko'p ball, liderboard) bolada *ichki motivatsiyani* siqib chiqaradi — bola bilim uchun emas, ball uchun o'ynaydigan bo'lib qoladi. 3–7 yosh uchun **ichki motivatsiyaga (qiziqish, o'z-yutuq, eksploratsiya) urg'u** berib, tashqi mukofotni yengil ushlash kerak.

### 6.1. Maskot — Mishka (markaziy)
- Bola bilan "do'st" qahramon. Tanishtiradi, quvonadi, rag'batlantiradi, sayohatda hamroh.
- Reaksiyalar: quvonish, qarsak, "ofarin!", o'ylanish, alqash. (Gus the Owl / Duolingo qushi modeliga o'xshash, lekin o'ziga xos.)

### 6.2. Mukofot tizimi (ichki-yo'naltirilgan)
- **Stikerlar/yulduzchalar:** har dars/o'yin uchun, lekin kamtarona.
- **Yig'iladigan dunyo:** bola **o'z bog'ini / hayvonot bog'ini / xonasini** quradi — har yutuq yangi element ochadi (kolleksiya = ichki motivatsiya, ball emas).
- **Qahramon sozlash:** Mishkaga shapka, sharf va h.k. (customization).
- **Sayohat xaritasi (progress map):** daraja — yo'l/orol/sayyora ko'rinishida vizual ilgarilash (quruq raqam emas).

### 6.3. Nima QILMASLIK kerak (anti-naqshlar)
- ❌ Kichiklar uchun ball/liderboard/raqobat (faqat 6–7 yosh uchun juda yengil, ixtiyoriy).
- ❌ Yutqazish, "o'lish", taymerli bosim (kichiklar).
- ❌ Streak buzilsa ayblovchi xabar bolaga (streak — ko'proq **ota-ona** paneliga).
- ❌ "Yana o'ynashga" majburlovchi tёmniy patternlar (sun'iy shoshilinch). Ekran vaqti cheklovi — ota-ona qo'lida.

### 6.4. Octalysis muvozanati
Ichki (qiziqish, o'z-rivoj, ijod) ↔ tashqi (yengil mukofot, kolleksiya) — ikkalasi balansda. Asosiy haydovchi: **"men yangi narsa bila olaman" hissi**.

---

## 7. Dizayn tizimi (bolalar UX — kritik)

> Bola **o'qiy olmaydi**. Shuning uchun dizaynning bosh qoidasi: **audio-birinchi, matnsiz, ulkan teginish nishonlari**.

### 7.1. Asosiy UX tamoyillari (tadqiqotdan)
- **Audio-birinchi:** Har ekran ovoz bilan tushuntiriladi. Ko'rsatma — ovozli (matn emas). Element bosilganda — uning nomi yangraydi.
- **Soddalik orqali tozalash (Toca Boca tamoyili):** Ortiqcha narsa yo'q. Kichiklar uchun ekranda 1–2 tanlov. Diqqatni jismoniy o'zaro ta'sirga qaratish.
- **Ulkan teginish nishonlari:** min ~80–100px, oralig'i keng (kichik barmoqlar, noaniq teginish).
- **Uzluksiz interaktivlik:** Har teginish — animatsion javob (bolalar dinamik grafika/ovozga ko'proq javob beradi).
- **Darhol feedback:** tovush effektlari + animatsiya har amalda.
- **Maskot-boshqaruvi:** navigatsiya Mishka orqali, menyu emas.

### 7.2. Vizual til
- **Ranglar:** issiq, yorqin, yuqori kontrast; rang-ko'r (colorblind) xavfsiz palitra. Rang — yagona ma'no tashuvchi emas (doim + shakl/ikona).
- **Shakllar:** yumaloq, do'stona; o'tkir burchaklar yo'q.
- **Tasvirlar:** iliq, bolalarbop illyustratsiya uslubi; izchil (bitta art-yo'nalish).
- **Tipografika:** kattalar zonasi uchun aniq, yumaloq shrift. Bolalar zonasida matn deyarli yo'q.
- **Animatsiya:** Framer Motion / GSAP — yumshoq, o'ynoqi, lekin chalg'itmaydigan.

### 7.3. Audio
- **Ona tilida so'zlovchi (native speaker) audio** — har so'z, har harf, har ko'rsatma uchun oldindan yozilgan. (Kontent yaratish bosqichida TTS vaqtinchalik o'rnini bosishi mumkin, lekin ishlab chiqarishda jonli ovoz.)
- Web Audio API — past kechikishli (low-latency) tovush.
- Musiqa/qo'shiqlar alohida trek.

### 7.4. Ota-ona darvozasi (Parent Gate)
Sozlamalar/xaridlarga kirishdan oldin **kattalar tekshiruvi** (COPPA uslubi): oddiy matematik misol yoki "uzoq bosib turing" — bola tasodifan kira olmasin.

### 7.5. Qulaylik (Accessibility)
Yirik nishonlar, oddiy oqim, audio-asos, kam matn — bu o'z-o'zidan inklyuziv. Qo'shimcha: kontrast, sekin/tez audio.

### Texnik eslatma (dizayn implementatsiyasi)
Frontend qurilganda `frontend-design` skill tamoyillariga amal qiling: dizayn tokenlari (CSS o'zgaruvchilari), izchil palitra/spacing/typography. Shablon-default ko'rinishidan qoching — o'ziga xos, iliq, bolalarbop identitet.

---

## 8. Foydalanuvchi modeli va xavfsizlik (COPPA/GDPR-K ruhi)

- **Bitta ota-ona akkaunti** (email yoki telefon) → **bir nechta bola profili**.
- **Bola profili:** ism (taxallus ham bo'ladi) + avatar + yosh-diapazon + ona tili. **Bola haqida minimal ma'lumot.** Bolaga alohida login/email YO'Q.
- **Bola rejimi = devor bilan o'ralgan bog':** chat yo'q, reklama yo'q, tashqi havola yo'q, ochiq internet yo'q, ijtimoiy funksiya yo'q.
- **Profilga o'tish:** ota-ona sessiyasi ichida PIN bilan (alohida autentifikatsiya emas).
- **Ota-ona paneli:** rivoj (qaysi so'zlar o'rganildi, mastery), vaqt cheklovi, hisobot, profil boshqaruvi.
- **Ma'lumot minimallashtirish:** bolalardan keraksiz shaxsiy ma'lumot yig'ilmaydi. Tahlil — anonim/agregat.

---

## 9. Texnik arxitektura

### 9.1. Yuqori darajadagi ko'rinish
```
┌─────────────────┐     HTTPS/JSON      ┌──────────────────────┐
│  Next.js PWA    │ ◄─────────────────► │  Django + DRF API    │
│  (TS, App Router)│   React Query       │  (JWT auth)          │
│  - bola rejimi   │                     │                      │
│  - ota-ona panel │                     ├──────────────────────┤
│  - offline cache │                     │  Celery worker/beat  │ ← audio ishlov,
│  - Web Audio     │                     │  (Redis broker)      │   SRS qayta hisob,
│  - Canvas (yozuv)│                     ├──────────────────────┤   bildirishnoma
└─────────────────┘                     │  PostgreSQL          │
        │                               ├──────────────────────┤
        │ media (audio/rasm)            │  Redis (cache+broker)│
        ▼                               ├──────────────────────┤
   Object storage (S3/MinIO) + CDN  ←── │  MinIO/S3 (media)    │
                                        └──────────────────────┘
                          Hammasi → Docker Compose (nginx reverse proxy)
```

### 9.2. Backend (Django + DRF)
- **Django REST Framework** — API. **JWT** (SimpleJWT) — ota-ona auth.
- **PostgreSQL** — asosiy baza. (Kelajakda partitioning — `LearningEvent` jadvali katta o'sadi, sizga TALIM'dan tanish.)
- **Redis** — kesh + Celery broker.
- **Celery (worker + beat)** — audio ishlov berish (transcode/normalize), SRS ommaviy qayta hisobi, ota-onaga bildirishnoma, kunlik agregat.
- **Django Admin** — kontent boshqaruvi (kurikulum, harflar, so'zlar, media, ertaklar) MVP uchun yetarli; keyin maxsus kontent-panel.
- **Media:** S3-mos object storage (prod: S3 / dev: MinIO), CDN orqali tarqatish.
- **Modullik:** TALIM'dagi kabi bounded-context'larga ajrating: `accounts`, `content` (kurikulum), `learning` (SRS+events), `gamification`, `media`, `billing` (B2B litsenziya).
- **Konfiguratsiya-asoslangan brending:** `/api/config/` — har institut/brending uchun rang, logo, yoqilgan modul/feature-flag. (TALIM yondashuvini qayta ishlatasiz — bir platforma, ko'p mijoz.)

### 9.3. Frontend (Next.js)
- **Next.js (App Router) + TypeScript**, **PWA** (o'rnatiladigan + offline). O'zbekistonda internet beqaror — **offline-birinchi dars pleyeri** muhim.
- **Holat:** Zustand (lokal/UI) + TanStack Query (server holati).
- **Audio:** Web Audio API. **Animatsiya:** Framer Motion / GSAP. **Yozuv:** Canvas (harf chizish/tracing).
- **i18n:** UI — o'zbek (lotin) + rus. Kontent — rus (maqsad) + o'zbek (ona tili yordami / L1 scaffolding). Arxitektura boshqa L1'larni ham qo'llab-quvvatlasin (B2B uchun).
- **Offline:** Service Worker — joriy birlik darslari + media keshlanadi; bola oflayn o'ynaydi; rivoj onlayn bo'lganda sync bo'ladi (outbox pattern).

### 9.4. Docker (Maqola/TALIM naqshlaringizga moslang)
`docker-compose.yml` xizmatlari:
```
services:
  web        # Next.js (build → start; dev: hot reload)
  api        # Django + Gunicorn/Uvicorn
  db         # postgres:16
  redis      # redis:7
  worker     # celery -A config worker
  beat       # celery -A config beat
  minio      # dev media storage (S3-mos)
  nginx      # reverse proxy + static/media
```
- `.env` orqali konfiguratsiya, `Dockerfile` har servis uchun (multi-stage: kichik prod image).
- Healthcheck'lar, `depends_on`, volume'lar (db, minio, media).
- **Eslatma:** Maqola loyihangizdagi tuzilmani ko'rsatib bersangiz (`docker-compose.yml`, `Dockerfile`), Phase 0'da aynan o'sha konvensiyaga (papka tuzilishi, env nomlari, network) moslab beraman.

---

## 10. Ma'lumotlar modeli (asosiy entitilar)

> To'liq DDL emas — Claude Code Django modellarini shu asosda yaratadi. Maydonlar yo'nalish uchun.

**accounts**
- `ParentAccount(id, email/phone, password_hash, locale, created_at, ...)`
- `ChildProfile(id, parent_id→Parent, display_name, avatar_id, birth_date|age_band, l1_locale='uz', current_level_id, pin_optional, created_at)`

**content (kurikulum)**
- `Language(id, code, name)` — masalan ru, uz
- `Level(id, language_id, order, title_uz, title_ru)`
- `Theme/Unit(id, level_id, order, key, title_uz, title_ru, icon)`
- `Lesson(id, theme_id, order, title_uz, title_ru, min_age_band)`
- `LessonStep(id, lesson_id, order, kind[intro|practice|mastery], config_json)`
- `Letter(id, language_id, char, sound_ipa, audio_id→Media, mnemonic_image_id→Media, group_no, order)`
- `Word(id, language_id, lemma, translit, l1_translation_json, image_id→Media, audio_native_id→Media, theme_id, difficulty, part_of_speech, gender, plural_form, freq_rank, is_cognate_uz)`
- `Phrase/Sentence(id, language_id, text, audio_id, l1_translation_json, word_refs[])` — TPRS/qo'shiq uchun
- `GameType(id, key, name, skill, min_age_band, schema_json)` — mexanika katalogi
- `Story(id, level_id, title, ...)` + `StoryNode(id, story_id, text/audio, image, choices_json[])`
- `Song(id, theme_id, title, audio_id, lyrics_json, word_refs[])`

**learning (SRS yadrosi)**
- `ChildWordState(id, child_id, word_id, box_no|stability, difficulty, due_at, last_result, exposures, receptive_mastery, expressive_mastery, updated_at)` ← **dvigatel yuragi**
- `ChildLetterState(id, child_id, letter_id, box_no|stability, due_at, ...)`
- `LearningEvent(id, child_id, item_type, item_id, game_type, is_correct, latency_ms, hint_used, session_id, ts)` ← analitika + SRS haydovchi
- `SessionLog(id, child_id, started_at, ended_at, items_count, ...)`

**gamification**
- `Reward(id, kind[sticker|collectible|customization], asset_id, ...)`
- `ChildReward(id, child_id, reward_id, earned_at)`
- `CollectionItem(id, child_id, collection_key, item_key, unlocked_at)` — bog'/zoo/xona
- `StreakRecord(id, child_id, current, longest, last_active_date)`

**media**
- `Media(id, kind[audio|image|lottie], storage_key, duration_ms, meta_json)`

**billing / B2B**
- `Subscription(id, parent_id, plan, status, period_end)`
- `Institution(id, name, branding_config_json)` + `ModuleLicense(id, institution_id, module_key, signed_key, valid_until)` — TALIM g'oyasi: institutga modul/brending sotish
- `BrandingConfig(id, scope[global|institution], theme_json, feature_flags_json)` — `/api/config/` shu yerdan

---

## 11. Yo'l xaritasi — fazalar umumiy ko'rinishi

| Faza | Nima | Natija |
|---|---|---|
| **0** | Repo + Docker skeleton (Django+DRF, Next.js, Postgres, Redis, Compose) | Hammasi `docker compose up` bilan ko'tariladi |
| **1** | Auth + ota-ona akkaunti + bola profillari + Parent Gate | Ro'yxat, kirish, profil yaratish/almashish |
| **2** | Kontent modeli + Django Admin + seed (1–2 mavzu + 1-harf guruhi) | Admin'da so'z/harf/dars kiritish; demo kontent |
| **3** | Media pipeline (audio/rasm) + kontent API (`/api/curriculum`, `/api/lesson`) | Frontend kontentni o'qiy oladi |
| **4** | Dizayn tizimi + bolalar UI qobig'i (Mishka, xarita, audio-first, ulkan nishon) PWA | O'ynaladigan, navigatsiyali, ovozli qobiq |
| **5** | O'yin dvigateli + 3 mexanika (Eshit&bos, Juftla, Topib ber) | Bola so'zlarni o'yin orqali o'rganadi |
| **6** | **SRS dvigateli** (`ChildWordState`, scheduler, due-API) + retrievalni o'yinga to'qish + `LearningEvent` | Ko'rinmas takrorlash ishlaydi |
| **7** | Kirill treki (tracing Canvas, harf o'yinlari, fonetika) | Alifbo o'rganish to'liq |
| **8** | Geymifikatsiya (mukofot, kolleksiya, xarita, Mishka reaksiyalari) + ota-ona paneli | Motivatsiya + ota-ona nazorati |
| **9** | Ertak rejimi (TPRS) + qo'shiqlar | Kontekstli o'rganish |
| **10** | Offline/PWA kesh + sync + sayqal + analitika | Beqaror internetda ishlaydi, hisobotlar |
| **11** | (Kelajak) Ovoz tanish (ASR), AI-tutor (Claude API), B2B brending, multiplayer | Kengaytmalar |

---

## 12. Bosqichma-bosqich Cursor / Claude Code promtlari

> Har promtni **alohida** yuboring. Promtdan oldin Claude Code'ga `docs/SPEC.md` ochiq turibdi deb eslating. Har faza tugagach, "Qabul mezonlari"ni tekshiring.

---

### 🟦 FAZA 0 — Skeleton va Docker

```
Loyihaning monorepo skeletini yarat. `docs/SPEC.md` (§9) ga amal qil.

Tuzilma:
/backend   — Django + Django REST Framework loyihasi (config + apps: accounts, content, learning, gamification, media, billing). PostgreSQL, Redis, Celery (worker+beat) sozlangan. settings env-asosli (django-environ).
/frontend  — Next.js (App Router) + TypeScript + Tailwind. PWA sozlangan (next-pwa yoki manual SW). TanStack Query + Zustand qo'shilgan.
/docker    — har servis uchun Dockerfile (multi-stage).
docker-compose.yml — services: web, api, db (postgres:16), redis:7, worker, beat, minio, nginx. Volume va healthcheck bilan.
.env.example — barcha kerakli o'zgaruvchilar.
Makefile — up/down/migrate/seed/logs qisqartmalari.

Talab:
- `docker compose up` bilan hammasi ko'tarilsin; api `/api/health/` 200 qaytarsin; frontend asosiy sahifa ochilsin.
- README'da local ishga tushirish yo'riqnomasi.
Hozircha biznes-logika YO'Q — faqat ishlaydigan skeleton.
```
**Qabul mezonlari:** `docker compose up` → API health 200, frontend ochiladi, migratsiyalar o'tadi, Celery worker ulanadi.

> 💡 Maqola loyihangizdagi `docker-compose.yml` ni ko'rsatsangiz, bu promtni aynan o'sha konvensiyaga moslayman.

---

### 🟦 FAZA 1 — Autentifikatsiya, ota-ona akkaunti, bola profillari

```
`docs/SPEC.md` (§8) bo'yicha autentifikatsiya va profil tizimini qur.

Backend (accounts app):
- ParentAccount modeli (email/telefon + parol). JWT (SimpleJWT): register, login, refresh, me.
- ChildProfile modeli (parentga bog'liq: display_name, avatar_id, age_band, l1_locale, ixtiyoriy PIN).
- API: profil CRUD, "profilga o'tish" (parent sessiyasi ichida child-context token).
- Bolalar uchun alohida login YO'Q — faqat ota-ona ichida.

Frontend:
- Ro'yxat/kirish ekranlari (ota-ona uchun, oddiy).
- Profil tanlash ekrani (kartochkalar + avatar, bolabop, ovozli salom).
- Parent Gate komponenti: sozlama/xaridga kirishdan oldin "uzoq bosib turing" yoki oddiy matematik misol.

Til: UI o'zbek (lotin), keyin rus tarjimasi uchun i18n tayyor (next-intl).
```
**Qabul mezonlari:** Ota-ona ro'yxatdan o'tadi/kiradi, 2+ bola profili yaratadi, profilga o'tadi; Parent Gate'siz sozlamaga kirib bo'lmaydi.

---

### 🟦 FAZA 2 — Kontent modeli + Admin + seed ma'lumot

```
`docs/SPEC.md` (§3, §10) bo'yicha kontent modelini va Django Admin'ni qur.

Modellar (content app): Language, Level, Theme/Unit, Lesson, LessonStep(kind: intro|practice|mastery),
Letter, Word, Phrase, GameType, Story, StoryNode, Song, Media.

Django Admin: bu modellarni qulay kiritish (inline'lar bilan: Lesson ichida LessonStep, Theme ichida Lesson). Media yuklash maydonlari.

Seed (management command `seed_content`):
- ru tili, Level 1.
- 1-harf guruhi (А, О, К, М, Т, С, Н, И) — har biri uchun char, sound, (placeholder) audio/rasm.
- 2 mavzu: "Hayvonlar (uy)" (кошка, собака, корова, ...) va "Ranglar" (красный, синий, ...) — har so'z uchun lemma, translit, o'zbekcha tarjima, placeholder rasm/audio, is_cognate_uz belgisi.
- Har mavzuda 1 ta Lesson (intro→practice→mastery step'lari bilan).
- GameType katalogi: §5 jadvalidagi 11 mexanika (key, skill, min_age_band, schema_json).
```
**Qabul mezonlari:** Admin'da kontent ko'rinadi/tahrirlanadi; `seed_content` demo darslarni yaratadi; GameType katalogi to'la.

---

### 🟦 FAZA 3 — Media pipeline + kontent API

```
`docs/SPEC.md` (§9.2, §7.3) bo'yicha media va kontent API'ni qur.

Media:
- MinIO/S3 ga yuklash; Media modeli storage_key, duration, meta saqlaydi.
- Celery task: audio normalize/transcode (mp3/ogg), rasm resize/optimize.
- CDN/proxy orqali xizmat.

Kontent API (DRF, child-context bilan):
- GET /api/curriculum/ — bola darajasiga mos Level→Theme→Lesson daraxti (rivoj holati bilan).
- GET /api/lesson/{id}/ — dars step'lari + ularga tegishli so'z/harf/media + tegishli GameType konfiglari.
- Javoblar audio/rasm URL'lari bilan to'liq (frontend qo'shimcha so'rovsiz o'ynay olsin).
- Optimallashtirish: kontent kamdan-kam o'zgaradi → kesh (Redis) + ETag.
```
**Qabul mezonlari:** Frontend `/api/curriculum` va `/api/lesson` orqali to'liq kontentni (media URL'lari bilan) oladi.

---

### 🟦 FAZA 4 — Dizayn tizimi + bolalar UI qobig'i (PWA)

```
`docs/SPEC.md` (§7) bo'yicha bolalar UI qobig'ini qur. `frontend-design` skill tamoyillariga amal qil.

Dizayn tizimi:
- Dizayn tokenlari (CSS o'zgaruvchilari): issiq/yorqin/rang-ko'r xavfsiz palitra, yumaloq shakllar, spacing, radius, soyalar.
- Komponentlar: katta yumaloq tugma (min 80–100px), kartochka, modal, Mishka maskot komponenti (holatlar: idle/cheer/think/celebrate — Lottie yoki sprite).
- Audio-birinchi: `useAudio` hook, har element bosilganda nomi yangraydi; ovozli ko'rsatma; matnga tayanmaslik.

Bolalar qobig'i:
- Uy ekrani: Mishka + sayohat xaritasi (Level→Theme vizual yo'l/orol ko'rinishida).
- Navigatsiya maskot/ikona orqali (matnli menyu emas).
- Framer Motion bilan yumshoq o'tishlar/animatsiyalar.
- PWA: o'rnatiladigan, to'liq ekran, spl screen.

Hozircha o'yin logikasi YO'Q — bosilganda placeholder. Maqsad: ovozli, animatsiyali, bolabop qobiq.
```
**Qabul mezonlari:** Bola xaritada yuradi, mavzu tanlaydi, har teginish ovoz+animatsiya beradi; ulkan nishonlar; matnga tayanmaydi; PWA o'rnatiladi.

---

### 🟦 FAZA 5 — O'yin dvigateli + dastlabki 3 mexanika

```
`docs/SPEC.md` (§5) bo'yicha data-driven o'yin dvigatelini qur.

Engine:
- GameType'ni kontent bilan to'ldirib render qiluvchi umumiy "GamePlayer" arxitekturasi (mexanika kontentdan mustaqil).
- Dars oqimi: intro → practice (mini-o'yinlar ketma-ketligi) → mastery → natija ekrani.
- Javob ↔ feedback: to'g'ri (Mishka quvonadi, konfetti, tovush) / xato (jazo yo'q, maslahat, qayta urinish).

3 mexanika:
1) Eshit va bos: audio yangraydi → bola to'g'ri rasmni bosadi (3–4 yosh: 2 variant).
2) Juftla (memory): rasm↔audio yoki rasm↔rasm juftlarini ochish.
3) Topib ber (TPR): sahnada "Покажи кошку!" — to'g'ri obyektni topib bosish.

Har javob lokal holatga yoziladi (Faza 6'da backendga ulanadi).
Mobil teginish + sekin/aniq UX kichik barmoqlar uchun.
```
**Qabul mezonlari:** Bola haqiqiy darsni boshidan oxiriga o'ynaydi (3 mexanika), to'g'ri/xato feedback ishlaydi, natija ekrani chiqadi.

---

### 🟦 FAZA 6 — SRS dvigateli (ko'rinmas takrorlash) — yadro

```
`docs/SPEC.md` (§4) bo'yicha ko'rinmas SRS dvigatelini qur — bu loyihaning yuragi.

Backend (learning app):
- ChildWordState (Leitner: box_no 1–6, due_at, exposures, last_result, receptive/expressive mastery). ChildLetterState shunga o'xshash.
- LearningEvent: har o'zaro ta'sir (child, item, game_type, is_correct, latency_ms, hint_used, session_id, ts).
- SRS xizmati:
   - record_result(child, item, correct, latency) → box va due_at yangilanadi (to'g'ri→ko'tariladi, xato→1-quti).
   - get_due(child, limit) → muddati kelgan so'z/harflar.
   - get_session_queue(child) → interleave(due_words, yangi_words), semantik interferensiyani oldini olib.
- API: POST /api/learning/event/ (natija yozish), GET /api/learning/session/ (o'yin navbati).

Frontend:
- Dars boshlanganda get_session_queue'dan navbat olinadi; har javob POST event bilan yoziladi (offline bo'lsa outbox'ga, keyin sync).
- Muddati kelgan so'zlar o'yinlarga "ko'rinmas" qo'shiladi (bola "takrorlash" so'zini ko'rmaydi).

MVP: Leitner. Keyingi iteratsiyada FSRS-lite (stability/difficulty) ga o'tish uchun interfeysni moslang.
```
**Qabul mezonlari:** Bola so'zni o'rgansa — keyingi sessiyalarda kengayuvchi intervallarda qaytadi; xato so'z tezroq qaytadi; barcha javoblar `LearningEvent`'ga yoziladi; navbat due+yangi'ni aralashtiradi.

---

### 🟦 FAZA 7 — Kirill treki (harflar, yozish, fonetika)

```
`docs/SPEC.md` (§3 Trek A, §5 #4–7) bo'yicha alifbo treki.

- Harf chizish (tracing): Canvas/SVG ustida harf konturi bo'ylab barmoq bilan yurish; to'g'ri yo'nalish ko'rsatkichi; Mishka rag'bati.
- Harf o'yinlari: "Harf ovi" (so'z/ekranda harfni top), "Qaysi tovush?" (tovush→harf), mnemonik tasvir bilan tanishtirish.
- "Bo'g'in/So'z qur" (6+): harf/bo'g'inlardan so'z yig'ish (raqamli "kassa bukv").
- Harflar ham SRS'ga ulanadi (ChildLetterState).
- Guruhlash tartibi §3 bo'yicha (oson→qiyin); rus fonetik afzalligi (1 harf≈1 tovush) metodikada hisobga olinadi.
```
**Qabul mezonlari:** Bola harf chizadi, tovushni harf bilan bog'laydi, harf o'yinlarini o'ynaydi; harflar SRS bo'yicha takrorlanadi.

---

### 🟦 FAZA 8 — Geymifikatsiya + ota-ona paneli

```
`docs/SPEC.md` (§6, §8) bo'yicha motivatsiya va ota-ona nazorati.

Geymifikatsiya (ichki-yo'naltirilgan):
- Mukofotlar: stiker/yulduzcha (kamtarona), yig'iladigan dunyo (bog'/zoo/xona — yutuq element ochadi), Mishka customization.
- Sayohat xaritasida vizual ilgarilash. Mishka boy reaksiyalar.
- ANTI-naqsh: kichiklarga ball/liderboard yo'q, jazo yo'q, streak bolaga ayblov emas.

Ota-ona paneli (Parent Gate ortida):
- Har bola bo'yicha rivoj: o'rganilgan/o'zlashtirilgan so'zlar, mastery foizi, faollik.
- Vaqt cheklovi sozlamalari (kunlik limit).
- Hisobot (haftalik xulosalar).
- Profil/avatar boshqaruvi.
```
**Qabul mezonlari:** Bola mukofot oladi, dunyosini quradi; ota-ona panelda aniq rivojni ko'radi va vaqtni boshqaradi.

---

### 🟦 FAZA 9 — Ertak rejimi (TPRS) + qo'shiqlar

```
`docs/SPEC.md` (§2.3, §5 #8–9) bo'yicha kontekstli o'rganish.

- Ertak rejimi (TPRS): o'rganilgan so'zlardan tuzilgan, tanlovli (choose-your-path) qisqa interaktiv ertaklar (Story/StoryNode). RICH tamoyili: takroriy, qiziqarli, tushunarli, yuqori chastotali. Har sahna: rasm + audio + tanlov.
- Qo'shiq rejimi: tematik qo'shiqlar (audio + animatsiya + so'z urg'usi). So'zlar SRS'ga hisoblanadi.
- Ertak/qo'shiqdagi so'zlar ham LearningEvent + SRS'ga ulanadi.
```
**Qabul mezonlari:** Bola tanlovli ertakni o'ynaydi, qo'shiq tinglaydi; kontentdagi so'zlar takrorlash dvigateliga qo'shiladi.

---

### 🟦 FAZA 10 — Offline/PWA + sync + sayqal + analitika

```
`docs/SPEC.md` (§9.3) bo'yicha offline-birinchi va polish.

- Service Worker: joriy mavzu darslari + media keshlanadi → bola oflayn o'ynaydi.
- Outbox/sync: oflayn LearningEvent'lar saqlanadi, onlayn bo'lganda backendga yuboriladi (idempotent).
- Konflikt yechimi: oxirgi-yozuv yoki server-merge (SRS holati uchun).
- Analitika dashboard (ichki): faollik, so'z o'zlashtirish egri chizig'i, qiyin so'zlar.
- Umumiy sayqal: yuklanish, animatsiya silliqligi, audio kechikishi, xatoliklarni qayta ishlash.
```
**Qabul mezonlari:** Internetsiz bola o'ynaydi; ulanish tiklanganda rivoj sync bo'ladi; analitika ko'rsatkichlari ishlaydi.

---

### 🟦 FAZA 11 — Kelajak (ixtiyoriy kengaytmalar)

- **Ovoz tanish (ASR):** "Aytib ber" o'yini — bola so'zni aytadi, tizim baholaydi (ekspressiv mastery). (Web Speech API / tashqi ASR.)
- **AI-tutor:** Claude API orqali shaxsiy rag'bat, savol-javob, adaptiv hikoya generatsiyasi. (Artefaktlarda Anthropic API'dan foydalanish mumkin.)
- **B2B brending paneli:** institutga rang/logo/modul sozlash (`/api/config/`, `ModuleLicense`) — bog'cha/markazlarga sotish.
- **Ko'p o'yinchi:** birga o'ynash, ota-ona-bola rejimi.
- **Adaptiv qiyinlik:** `LearningEvent` ma'lumotidan o'rganib, dars temposini moslash.

---

## 13. Tavsiyalar va keyingi qadamlar

1. **Maqola Docker tuzilmangizni ko'rsating** — Phase 0'ni aynan sizning konvensiyangizga moslayman (papka, env, network nomlari).
2. **Avval MVP yadro (Faza 0–6) ni qiling** — bu allaqachon ishlaydigan, so'z o'rgatadigan mahsulot. Qolganlari ustiga quriladi.
3. **Kontent — eng katta ish.** So'z/rasm/audio (jonli ovoz) tayyorlash kod yozishdan ko'p vaqt oladi. Boshida 1–2 mavzudan boshlang, sifatni sayqallang, keyin ko'paytiring. Kognat so'zlardan (`stol`, `park`...) boshlang — tez g'alaba.
4. **3–4 va 5–7 ni ajrating** — bitta ilova, lekin `age_band` bo'yicha murakkablik moslashadi.
5. **Farzandlaringizda sinab ko'ring** — eng yaxshi test. Bola qayerda chalkashsa — o'sha joy dizayn muammosi.

---

### Ilmiy manbalar (metodika asoslari)
- **TPR:** Asher, J. (1977) *Learning Another Language Through Actions.*
- **Comprehensible Input:** Krashen, S. (1982) *Principles and Practice in SLA.*
- **TPRS:** Ray, B. — TPR Storytelling.
- **Dual Coding:** Paivio, A. (1986) *Mental Representations.*
- **Retrieval/Spacing (bolalar):** NIH PMC8126157, PMC8084525 — 4–5 yoshlilarda repeated spaced retrieval samaradorligi.
- **Spacing intervallari:** Cepeda et al. (2008) — optimal retention temporal ridgeline.
- **SRS algoritmi:** FSRS (ochiq), SuperMemo SM-2, Leitner system.
- **Geymifikatsiya (erta yosh):** Octalysis Framework; intrinsic vs extrinsic ogohlantirishlari.
- **Bolalar UX:** Toca Boca (soddalik orqali tozalash), Duolingo (gamified scaffolding); Hirsh-Pasek va b. (faol, ma'noli, ijtimoiy, maqsadli o'rganish).

> Bu hujjat — tirik. Loyiha o'sgani sari yangilang. Omad, Mishka kutmoqda! 🐻
