"""SRS scheduler — IZOLYATSIYALANGAN, ALMASHTIRILADIGAN interval mantig'i (ADR-013).

MVP: konservativ SM-2-lite (haqiqiy bola ma'lumotisiz FSRS parametrlarini sozlab bo'lmaydi).
Keyin (Faza 10+): bu funksiyani sozlangan to'liq FSRS'ga almashtirish MODEL yoki EVENT yozuvni
O'ZGARTIRMAYDI — faqat schedule() ICHI o'zgaradi. Qolgan hamma narsa undan mustaqil.
"""

from datetime import timedelta

from django.utils import timezone

# Konservativ kengayuvchi intervallar (kun). Birinchi takrorlar qat'iy, keyin ×EASE.
FIRST_INTERVALS = [1, 3, 7]
EASE = 2.2
MAX_INTERVAL_DAYS = 365
WRONG_RETURN_MINUTES = 10  # xato → shu/keyingi sessiyada tez qaytadi


def schedule(state, is_correct: bool, latency_ms: int | None = None):
    """ItemState'ni yangilaydi (yangi due_at). Sof: state'ni mutatsiya qiladi va qaytaradi.

    To'g'ri → interval/stability oshadi (due_at uzoqlashadi).
    Xato → interval qisqaradi (due_at yaqinlashadi), lapse++, reps=0.
    """
    now = timezone.now()

    if is_correct:
        if state.reps < len(FIRST_INTERVALS):
            interval_days = FIRST_INTERVALS[state.reps]
        else:
            interval_days = min(round(max(state.stability, 1.0) * EASE), MAX_INTERVAL_DAYS)
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

    state.last_reviewed_at = now
    return state
