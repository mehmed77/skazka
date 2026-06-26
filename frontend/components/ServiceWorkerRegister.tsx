"use client";

import { useEffect } from "react";

// PWA: service worker'ni ro'yxatdan o'tkazadi (offline kesh — SPEC §9.3).
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* dev'da xato bo'lsa jim o'tamiz */
      });
    }
  }, []);
  return null;
}
