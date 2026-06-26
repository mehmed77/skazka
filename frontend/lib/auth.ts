// Ota-ona auth holati (Zustand). Tokenlar mavjud axios interceptor (lib/api) orqali.
import { create } from "zustand";

import { api, tokenStore } from "./api";
import type { Parent } from "./types";

type AuthState = {
  parent: Parent | null;
  ready: boolean; // fetchMe bajarildimi (Guard kutadi)
  register: (data: {
    phone?: string;
    email?: string;
    full_name?: string;
    password: string;
  }) => Promise<void>;
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  parent: null,
  ready: false,

  async register(data) {
    const { data: res } = await api.post("/auth/register/", data);
    tokenStore.set(res.access, res.refresh);
    set({ parent: res.parent, ready: true });
  },

  async login(login, password) {
    const { data } = await api.post("/auth/login/", { login, password });
    tokenStore.set(data.access, data.refresh);
    set({ parent: data.parent, ready: true });
  },

  async logout() {
    const refresh = tokenStore.refresh;
    try {
      if (refresh) await api.post("/auth/logout/", { refresh });
    } catch {
      /* token eskirgan bo'lsa ham chiqamiz */
    }
    tokenStore.clear();
    set({ parent: null });
  },

  async fetchMe() {
    if (!tokenStore.access) {
      set({ parent: null, ready: true });
      return;
    }
    try {
      const { data } = await api.get("/auth/me/");
      set({ parent: data, ready: true });
    } catch {
      tokenStore.clear();
      set({ parent: null, ready: true });
    }
  },
}));
