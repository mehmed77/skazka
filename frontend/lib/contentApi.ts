// Kontent API klienti — BOLA-KONTEKST token bilan (Faza 1 dizayni: /curriculum, /lesson
// active_child_id claim'ini talab qiladi). Ota-ona API'si (lib/api) alohida.
import axios from "axios";

import { childTokenStore } from "./child";
import type { ResolvedItem } from "./games/types";
import type { Curriculum } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export const contentApi = axios.create({ baseURL: API_URL });

contentApi.interceptors.request.use((config) => {
  const token = childTokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

contentApi.interceptors.response.use(
  (r) => r,
  (error) => {
    // Bola-kontekst eskirgan/yo'q → profil tanlashga qaytar
    if (error.response?.status === 401 && typeof window !== "undefined") {
      childTokenStore.clear();
      window.location.href = "/profiles";
    }
    return Promise.reject(error);
  }
);

export const fetchCurriculum = async (): Promise<Curriculum> =>
  (await contentApi.get("/curriculum/")).data;

export const fetchLesson = async (id: string) =>
  (await contentApi.get(`/lesson/${id}/`)).data;

// Faza 6 — SRS: muddati kelgan (due) itemlar + idempotent event yozish
export const fetchDue = async (): Promise<{ due: ResolvedItem[]; count: number }> =>
  (await contentApi.get("/learning/session/")).data;

export const postEvent = async (ev: Record<string, unknown>): Promise<void> => {
  await contentApi.post("/learning/event/", ev);
};

// Faza 8 — geymifikatsiya (bola-kontekst): o'rmon dunyosi + vaqt tekshiruvi
export type ForestReward = {
  key: string;
  title_uz: string;
  title_ru: string;
  asset: string;
  new: boolean;
  slot?: string;
  icon?: string;
  category?: string;
};
export type ForestWorld = {
  elements: ForestReward[];
  mishka: ForestReward[];
  achievements: ForestReward[];
  recent: { kind: string; title_uz: string; title_ru: string; asset: string }[];
  streak: { current: number; longest: number };
};
export const fetchForest = async (): Promise<ForestWorld> =>
  (await contentApi.get("/gamification/forest/")).data;

// "Yangi" mukofotlarni ko'rilgan deb belgilash (ResultView "yangi do'st" ko'rsatgach — GET endi belgilamaydi)
export const markForestSeen = async (): Promise<void> => {
  await contentApi.post("/gamification/forest/seen/", {});
};

export type TimeCheck = { minutes_today: number; limit: number | null; exceeded: boolean };
export const fetchTimeCheck = async (): Promise<TimeCheck> =>
  (await contentApi.get("/gamification/timecheck/")).data;
