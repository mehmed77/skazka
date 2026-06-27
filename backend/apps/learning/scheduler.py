"""SRS scheduler — IZOLYATSIYALANGAN, ALMASHTIRILADIGAN interval mantig'i (ADR-013).

MVP: konservativ SM-2-lite. Keyin (Faza 10+) bu funksiyani sozlangan to'liq FSRS'ga almashtirish
MODEL yoki EVENT yozuvni O'ZGARTIRMAYDI — faqat schedule() ICHI.

Faza 7: `dimension` parametri — qaysi mastery (reseptiv/ekspressiv) yangilanishini ko'rsatadi.
Interval (due_at/stability/reps) UMUMIY; faqat strength dimension bo'yicha ajratiladi. Izolyatsiya
parametr orqali saqlanadi (model/event tegilmaydi).
"""

from datetime import timedelta

from django.utils import timezone

# Konservativ kengayuvchi intervallar (kun). Birinchi takrorlar qat'iy, keyin ×EASE.
FIRST_INTERVALS = [1, 3, 7]
EASE = 2.2
MAX_INTERVAL_DAYS = 365
WRONG_RETURN_MINUTES = 10  # xato → shu/keyingi sessiyada tez qaytadi

# Mastery (§4.3) — to'g'ri javob kuchaytiradi, xato kamaytiradi (0..1)
STRENGTH_GAIN = 0.34  # ~3 to'g'ri → o'zlashtirildi
STRENGTH_PENALTY = 0.5

RECEPTIVE = "receptive"
EXPRESSIVE = "expressive"


def schedule(
    state, is_correct: bool, latency_ms: int | None = None, dimension: str = RECEPTIVE
):
    """ItemState'ni yangilaydi (yangi due_at + tegishli strength). state'ni mutatsiya qilib qaytaradi.

    To'g'ri → interval/stability oshadi (due_at uzoqlashadi), strength oshadi.
    Xato → interval qisqaradi (due_at yaqinlashadi), lapse++, strength kamayadi.
    dimension: 'receptive' (tanib olish) yoki 'expressive' (ishlab chiqarish) strength'ni tanlaydi.
    """
    now = timezone.now()

    # ── Interval (UMUMIY — har ikki o'lchov bitta due_at'ni baham ko'radi) ──
    if is_correct:
        if state.reps < len(FIRST_INTERVALS):
            interval_days = FIRST_INTERVALS[state.reps]
        else:
            interval_days = min(
                round(max(state.stability, 1.0) * EASE), MAX_INTERVAL_DAYS
            )
        state.reps += 1
        state.stability = float(interval_days)
        state.difficulty = max(0.0, state.difficulty - 0.05)
        state.due_at = now + timedelta(days=interval_days)
    else:
        state.lapses += 1
        state.reps = 0
        state.stability = 0.0
        state.difficulty = min(1.0, state.difficulty + 0.2)
        state.due_at = now + timedelta(minutes=WRONG_RETURN_MINUTES)

    # ── Mastery (DIMENSION bo'yicha ajratilgan) ──
    field = "expressive_strength" if dimension == EXPRESSIVE else "receptive_strength"
    current = getattr(state, field)
    if is_correct:
        setattr(state, field, min(1.0, current + STRENGTH_GAIN))
    else:
        setattr(state, field, max(0.0, current - STRENGTH_PENALTY))

    state.last_reviewed_at = now
    return state
