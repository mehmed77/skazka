// Kontent API klienti — BOLA-KONTEKST token bilan (Faza 1 dizayni: /curriculum, /lesson
// active_child_id claim'ini talab qiladi). Ota-ona API'si (lib/api) alohida.
import axios from "axios";

import { childTokenStore } from "./child";
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
