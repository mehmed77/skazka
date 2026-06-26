---
title: Geymifikatsiya moduli
type: modul
tags: [modul/gamification, loyiha, pedagogika]
status: rejada
faza: Faza 8
created: 2026-06-26
---

# 🐻 Geymifikatsiya moduli

> Faza 8 · Bog'liq: [[01-Loyiha/Pedagogik-Asos]] · [[06-Modullar/Dizayn-Tizimi]] · [[06-Modullar/SRS-Learning]] · [[01-Loyiha/Foydalanuvchi-Rollari]]

SPEC §6: **muvozanatli, ichki-yo'naltirilgan** motivatsiya. Asosiy haydovchi — "men yangi narsa bila olaman" hissi, ball emas.

> [!warning] Ilmiy ogohlantirish (SPEC §6)
> Haddan ortiq tashqi mukofot (ko'p ball, liderboard) 3–7 yoshda **ichki motivatsiyani siqib
> chiqaradi**. Shuning uchun tashqi mukofot yengil ushlanadi; urg'u — qiziqish, o'z-yutuq, eksploratsiya.

## Mukofot tizimi (ichki-yo'naltirilgan)

| Mexanika | Tavsif | Model |
|---|---|---|
| Stiker/yulduzcha | Har dars/o'yin uchun, **kamtarona** | `Reward(kind=sticker)`, `ChildReward` |
| Yig'iladigan dunyo | Bola **bog'/zoo/xona** quradi; yutuq element ochadi | `CollectionItem(collection_key, item_key)` |
| Mishka customization | Shapka, sharf va h.k. | `Reward(kind=customization)` |
| Sayohat xaritasi | Daraja — yo'l/orol/sayyora ko'rinishida vizual ilgarilash | progress map (frontend) |
| Streak | Faollik ketma-ketligi — bolaga emas, **ota-ona paneliga** | `StreakRecord(current, longest, last_active_date)` |

## Mishka reaksiyalari
- Quvonish, qarsak, "ofarin!", o'ylanish, alqash — SRS/o'yin natijasiga bog'lab triggerlanadi.
- Holatlar/aktivlar → [[06-Modullar/Dizayn-Tizimi#Mishka maskot holatlari]].
- Navigatsiya menyu emas, Mishka orqali.

## Ota-ona paneli (Parent Gate ortida)
- Har bola bo'yicha rivoj: o'rganilgan/o'zlashtirilgan so'zlar, mastery foizi → [[06-Modullar/SRS-Learning]].
- Vaqt cheklovi (kunlik limit), haftalik hisobot, profil/avatar boshqaruvi.

## Anti-naqshlar (NIMA QILMASLIK — SPEC §6.3)
> [!info] Kichiklar uchun taqiqlar
> - ❌ Ball/liderboard/raqobat (kichiklar uchun). Faqat 6–7 yoshga juda yengil, ixtiyoriy.
> - ❌ Yutqazish, "o'lish", taymerli bosim.
> - ❌ Streak buzilsa bolaga ayblovchi xabar (streak → ota-ona).
> - ❌ "Yana o'ynashga" majburlovchi tёmniy patternlar. Ekran vaqti — ota-ona qo'lida.

## Acceptance
- [ ] Bola mukofot oladi (stiker), dunyosini quradi (bog'/zoo/xona ochiladi).
- [ ] Mishka boy reaksiyalar bilan natijaga javob beradi.
- [ ] Sayohat xaritasi vizual ilgarilashni ko'rsatadi (quruq raqam emas).
- [ ] Ota-ona panelda aniq rivojni ko'radi va vaqtni boshqaradi.
- [ ] Kichiklar oqimida ball/liderboard/taymer YO'Q.
