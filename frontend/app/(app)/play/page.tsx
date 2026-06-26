"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Eski stub — endi bola uyi = o'rmon xaritasi (/forest). Mos kelish uchun redirect.
export default function PlayRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/forest");
  }, [router]);
  return null;
}
