---
title: Foydali havolalar
type: resurs
tags: [resurs, havolalar, manbalar, meta]
status: aktiv
created: 2026-06-26
---

# 🔗 Foydali Havolalar

> Bog'liq: [[SPEC|📜 To'liq Spetsifikatsiya]] · [[99-Resurslar/Glossariy|📖 Glossariy]] · [[02-Arxitektura/Texnologiyalar-Steki|🧱 Texnologiyalar Steki]] · [[00-Home|🏠 Bilim Markazi]]

> [!abstract] Bu nima
> SKAZKA ustida ishlashda kerak bo'ladigan tashqi rasmiy hujjatlar, kutubxonalar va
> ilmiy manbalar to'plami. Ichki haqiqat manbai esa har doim — [[SPEC|📜 SPEC.md]].

## 🛠️ Stek — rasmiy hujjatlar

| Texnologiya | Havola | Eslatma |
|---|---|---|
| Obsidian | https://help.obsidian.md | Vault, wikilink, callout, Dataview/Kanban plaginlar |
| Next.js (App Router) | https://nextjs.org/docs/app | Frontend — TS, App Router. [[02-Arxitektura/Texnologiyalar-Steki]] |
| Next.js PWA | https://nextjs.org/docs/app/building-your-application/configuring/progressive-web-apps | Offline-birinchi dars pleyeri |
| React Query (TanStack) | https://tanstack.com/query/latest | Server holati |
| Zustand | https://zustand.docs.pmnd.rs | Lokal/UI holati |
| Django | https://docs.djangoproject.com/en/stable/ | Backend yadrosi |
| Django REST Framework | https://www.django-rest-framework.org | API. [[02-Arxitektura/API-Dizayni]] |
| SimpleJWT | https://django-rest-framework-simplejwt.readthedocs.io | Ota-ona JWT auth |
| Celery | https://docs.celeryq.dev/en/stable/ | worker + beat, Redis broker |
| Redis | https://redis.io/docs/latest/ | Kesh + Celery broker |
| PostgreSQL | https://www.postgresql.org/docs/ | Asosiy baza |
| MinIO | https://min.io/docs/minio/linux/index.html | Dev S3-mos media storage. [[06-Modullar/Media]] |
| Docker Compose | https://docs.docker.com/compose/ | [[05-DevOps/Docker-Setup]] |
| Web Audio API | https://developer.mozilla.org/docs/Web/API/Web_Audio_API | Past kechikishli tovush |
| Framer Motion | https://www.framer.com/motion/ | Animatsiya. [[06-Modullar/Dizayn-Tizimi]] |

## 🧠 SRS algoritmlari

| Manba | Havola | Eslatma |
|---|---|---|
| FSRS algoritmi | https://github.com/open-spaced-repetition/fsrs4anki/wiki | 2-bosqich `FSRS-lite` uchun ilhom |
| FSRS spec | https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler | `stability` + `difficulty` modeli |
| Leitner system | https://en.wikipedia.org/wiki/Leitner_system | MVP quti-asosli usul |
| SuperMemo SM-2 | https://super-memory.com/english/ol/sm2.htm | Klassik interval algoritmi |

> [!info] SRS tanlovi
> SKAZKA boshida **Leitner** (oddiy, MVP), keyin **FSRS-lite** (aniqroq) — qarang
> [[02-Arxitektura/SRS-Dvigateli]] va [[99-Resurslar/Qaror-Jurnali#ADR-004]].

## 🎨 UX va o'yin dizayni (referens)

| Manba | Havola | Eslatma |
|---|---|---|
| Toca Boca | https://tocaboca.com | Soddalik orqali tozalash, ochiq o'yin |
| Duolingo (dizayn) | https://design.duolingo.com | Gamified scaffolding, maskot modeli (lekin anti-naqshlarga e'tibor) |

## 📚 Ilmiy manbalar (metodika asoslari)

| Manba | Atama | Bog'liq |
|---|---|---|
| Asher, J. (1977) *Learning Another Language Through Actions* | TPR | [[01-Loyiha/Pedagogik-Asos]] |
| Krashen, S. (1982) *Principles and Practice in SLA* | Comprehensible Input (i+1) | [[01-Loyiha/Pedagogik-Asos]] |
| Ray, B. — TPR Storytelling | TPRS | [[06-Modullar/Oyin-Mexanikalari]] |
| Paivio, A. (1986) *Mental Representations* | Dual Coding | [[01-Loyiha/Pedagogik-Asos]] |
| NIH PMC8126157, PMC8084525 | bolalarda spaced retrieval | [[02-Arxitektura/SRS-Dvigateli]] |
| Cepeda et al. (2008) | optimal spacing intervallari | [[02-Arxitektura/SRS-Dvigateli]] |
| Octalysis Framework | geymifikatsiya (intrinsic vs extrinsic) | [[06-Modullar/Geymifikatsiya]] |

> [!tip] Havola qo'shish
> Yangi foydali manba topsangiz — tegishli jadvalga qo'shing va imkon bo'lsa
> ichki `[[wikilink]]` bilan bog'lang. Ichki tafsilot uchun esa avval [[SPEC]] ni o'qing.
