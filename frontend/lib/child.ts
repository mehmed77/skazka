// Bola-kontekst (enter'dan keyin). Token alohida saqlanadi — ota-ona tokeni saqlanib qoladi.
// Keyingi fazalarda "learning" so'rovlari shu token bilan yuboriladi.
import { create } from "zustand";

import { api } from "./api";
import type { ChildProfile } from "./types";

const CHILD_KEY = "skazka_child_access";

export const childTokenStore = {
  get access() {
    return typeof window === "undefined" ? null : localStorage.getItem(CHILD_KEY);
  },
  set(token: string) {
    localStorage.setItem(CHILD_KEY, token);
  },
  clear() {
    localStorage.removeItem(CHILD_KEY);
  },
};

type ChildState = {
  child: ChildProfile | null;
  enter: (profileId: string, pin?: string) => Promise<void>;
  exit: () => void;
};

export const useChild = create<ChildState>((set) => ({
  child: null,
  async enter(profileId, pin) {
    const { data } = await api.post(`/profiles/${profileId}/enter/`, { pin });
    childTokenStore.set(data.access);
    set({ child: data.child });
  },
  exit() {
    childTokenStore.clear();
    set({ child: null });
  },
}));
