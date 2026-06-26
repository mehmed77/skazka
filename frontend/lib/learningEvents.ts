// LearningEvent yozish — Faza 6 kontrakti. HOZIR: localStorage outbox (lokal).
// FAZA 6: POST /api/v1/learning/event/ (bola-kontekst, idempotent, onlayn bo'lganda sync).
// Interfeys o'zgarmaydi — GamePlayer/mexanikalar shuni chaqiradi.
import type { AnswerResult } from "./games/types";

const OUTBOX_KEY = "skazka_learning_outbox";

export function recordResult(ev: AnswerResult): void {
  try {
    const cur = JSON.parse(localStorage.getItem(OUTBOX_KEY) || "[]");
    cur.push({
      item_type: ev.itemType,
      item_id: ev.itemId,
      game_type: ev.gameType,
      is_correct: ev.correct,
      latency_ms: ev.latencyMs,
      hint_used: ev.hintUsed,
      ts: Date.now(),
    });
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(cur));
  } catch {
    /* graceful — yozuv UInavbatini to'xtatmaydi */
  }
  // FAZA 6: contentApi.post("/learning/event/", {...}) — outbox sync
}

export function getOutbox(): unknown[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || "[]");
  } catch {
    return [];
  }
}

export function clearOutbox(): void {
  try {
    localStorage.removeItem(OUTBOX_KEY);
  } catch {
    /* graceful */
  }
}
