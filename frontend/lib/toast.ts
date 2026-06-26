// Yengil toast do'koni (Zustand) — 3.5s avtomatik yopiladi.
import { create } from "zustand";

export type Toast = { id: number; kind: "success" | "error" | "info"; text: string };

type ToastState = {
  toasts: Toast[];
  push: (kind: Toast["kind"], text: string) => void;
  remove: (id: number) => void;
};

let _id = 0;

export const useToasts = create<ToastState>((set) => ({
  toasts: [],
  push: (kind, text) => {
    const id = ++_id;
    set((s) => ({ toasts: [...s.toasts, { id, kind, text }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export const toast = {
  success: (text: string) => useToasts.getState().push("success", text),
  error: (text: string) => useToasts.getState().push("error", text),
  info: (text: string) => useToasts.getState().push("info", text),
};
