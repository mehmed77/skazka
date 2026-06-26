"""accounts — ota-ona akkaunti va bola profillari (SPEC §8, §10).

Skeleton: hozircha model yo'q (Django standart User ishlatiladi).

Faza 1'da qo'shiladi:
- ParentAccount(email/telefon, parol, locale)  — email-asosli ota-ona auth (JWT)
- ChildProfile(parent→, display_name, avatar, age_band, l1_locale='uz', pin?)

Diqqat: AUTH_USER_MODEL'ni o'sha fazada, TOZA DB ustida belgilang
(`docker compose down -v`), keyin migration qiling.
"""
