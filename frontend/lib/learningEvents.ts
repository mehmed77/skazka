// LearningEvent yozish — OUTBOX → SYNC (Faza 6). recordResult/recordExposure har eventga
// event_id (UUID) generatsiya qiladi → localStorage outbox → POST /learning/event/ (idempotent).
// Online bo'lsa darhol; tarmoq uzilsa lokal qoladi, qayta ulanganda yuboriladi (dublikat xavfsiz).
// ⚠️ Faza 10 (to'liq offline/PWA cache) shu outbox interfeysini KENGAYTIRADI, qayta yozmaydi.
"use client";

import { postEvent } from "./contentApi";
import type { AnswerResult } from "./games/types";

const OUTBOX_KEY = "skazka_learning_outbox";

function uuid(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fallback quyida */
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

let _sessionId: string | null = null;
function sessionId(): string {
  if (!_sessionId) _sessionId = uuid();
  return _sessionId;
}

type OutboxEvent = {
  event_id: string;
  item_type: string;
  item_id: string;
  game_type: string;
  is_correct: boolean;
  latency_ms: number | null;
  hint_used: boolean;
  session_id: string;
};

function read(): OutboxEvent[] {
  try {
    return JSON.parse(localStorage.getItem(OUTBOX_KEY) || "[]");
  } catch {
    return [];
  }
}
function write(box: OutboxEvent[]): void {
  try {
    localStorage.setItem(OUTBOX_KEY, JSON.stringify(box));
  } catch {
    /* graceful */
  }
}
function enqueue(ev: OutboxEvent): void {
  const box = read();
  box.push(ev);
  write(box);
}

let _flushing = false;

// Outbox'ni yuborish — muvaffaqiyatda o'chiradi; tarmoq/5xx → qoldiradi (keyin); 4xx → tashlaydi.
export async function flushOutbox(): Promise<void> {
  if (_flushing || typeof window === "undefined") return;
  _flushing = true;
  try {
    for (const ev of read()) {
      try {
        await postEvent(ev);
        write(read().filter((e) => e.event_id !== ev.event_id));
      } catch (err: unknown) {
        const status =
          typeof err === "object" && err && "response" in err
            ? (err as { response?: { status?: number } }).response?.status
            : undefined;
        if (status && status >= 400 && status < 500) {
          // 4xx (validatsiya / kontekst) — qayta urinish foydasiz → tashlab yuboramiz
          write(read().filter((e) => e.event_id !== ev.event_id));
        } else {
          break; // tarmoq / 5xx → outbox'da qoladi, online qaytganda qayta urinamiz
        }
      }
    }
  } finally {
    _flushing = false;
  }
}

// Mexanika javobi (Faza 5 interfeysi — signatura O'ZGARMAYDI; ichida event_id + sync qo'shildi)
export function recordResult(ev: AnswerResult): void {
  enqueue({
    event_id: uuid(),
    item_type: ev.itemType,
    item_id: ev.itemId,
    game_type: ev.gameType,
    is_correct: ev.correct,
    latency_ms: ev.latencyMs,
    hint_used: ev.hintUsed,
    session_id: sessionId(),
  });
  void flushOutbox();
}

// Intro exposure — so'z ko'rilganda ItemState yaratiladi (backend: due +1kun, schedule yo'q)
export function recordExposure(item: { id: string; type: string }): void {
  enqueue({
    event_id: uuid(),
    item_type: item.type,
    item_id: item.id,
    game_type: "intro",
    is_correct: true,
    latency_ms: null,
    hint_used: false,
    session_id: sessionId(),
  });
  void flushOutbox();
}

export function getOutbox(): OutboxEvent[] {
  return read();
}

// Online qaytganda outbox'ni yuborish (bir marta bog'lanadi — Faza 10 poydevori)
if (typeof window !== "undefined" && !(window as unknown as { __skazkaOnline?: boolean }).__skazkaOnline) {
  (window as unknown as { __skazkaOnline?: boolean }).__skazkaOnline = true;
  window.addEventListener("online", () => {
    void flushOutbox();
  });
}
