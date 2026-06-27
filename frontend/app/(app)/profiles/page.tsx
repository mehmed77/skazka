"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Button, Input } from "@/components/ui";
import { PinPad } from "@/components/PinPad";
import { api } from "@/lib/api";
import { AVATARS, avatarEmoji } from "@/lib/avatars";
import { useChild } from "@/lib/child";
import { cn } from "@/lib/cn";
import { useAudio } from "@/lib/useAudio";
import type { AgeBand, ChildProfile } from "@/lib/types";

const AGE_BANDS: AgeBand[] = ["3-4", "5-6", "6-7"];

export default function ProfilesPage() {
  const t = useTranslations("profiles");
  const tp = useTranslations("parent");
  const router = useRouter();
  const qc = useQueryClient();
  const { speak } = useAudio();
  const enter = useChild((s) => s.enter);

  const { data: profiles = [], isLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data } = await api.get("/profiles/");
      return (data.results ?? data) as ChildProfile[];
    },
  });

  useEffect(() => {
    speak("Привет! Кто играет?", "ru-RU");
  }, [speak]);

  // ── enter (PIN bilan yoki PINsiz) ──
  const [pinFor, setPinFor] = useState<ChildProfile | null>(null);
  const [pinError, setPinError] = useState(false);

  const doEnter = async (child: ChildProfile, pin?: string) => {
    try {
      await enter(child.id, pin);
      router.push("/forest");
    } catch {
      setPinError(true);
    }
  };

  const onCardClick = (child: ChildProfile) => {
    if (child.has_pin) {
      setPinError(false);
      setPinFor(child);
    } else {
      doEnter(child);
    }
  };

  // ── yaratish ──
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    age_band: "3-4" as AgeBand,
    avatar_id: "mishka",
    pin: "",
  });
  const createMut = useMutation({
    mutationFn: () => api.post("/profiles/", form),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profiles"] });
      setCreating(false);
      setForm({ display_name: "", age_band: "3-4", avatar_id: "mishka", pin: "" });
    },
  });

  return (
    <div className="py-4">
      <h1 className="mb-6 text-center text-3xl font-extrabold text-brand-700">
        {t("greeting")}
      </h1>

      {isLoading ? (
        <p className="text-center text-muted-foreground">…</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {profiles.map((c) => (
            <div key={c.id} className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => onCardClick(c)}
                className="flex flex-col items-center gap-2 rounded-blob bg-card p-5 shadow-soft transition hover:scale-105 active:scale-95"
              >
                <span className="text-6xl">{avatarEmoji(c.avatar_id)}</span>
                <span className="text-lg font-bold">{c.display_name}</span>
                <span className="text-xs text-muted-foreground">
                  {c.age_band} {c.has_pin ? "🔒" : ""}
                </span>
              </button>
              {/* Ota-ona paneli (rivoj) — REAL SRS (Faza 8) */}
              <Link
                href={`/children/${c.id}`}
                className="text-center text-xs font-semibold text-brand-600 hover:underline"
              >
                📊 {tp("rivoj")}
              </Link>
            </div>
          ))}

          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex flex-col items-center justify-center gap-2 rounded-blob border-2 border-dashed border-border p-5 text-muted-foreground transition hover:border-brand-400 hover:text-brand-600"
          >
            <span className="text-5xl">＋</span>
            <span className="font-semibold">{t("add")}</span>
          </button>
        </div>
      )}

      {profiles.length === 0 && !isLoading && (
        <p className="mt-6 text-center text-muted-foreground">{t("empty")}</p>
      )}

      {/* ── PIN modal ── */}
      {pinFor && (
        <Modal onClose={() => setPinFor(null)}>
          <h2 className="mb-4 text-center text-xl font-bold">
            {pinError ? t("wrongPin") : t("enterPin")}
          </h2>
          <PinPad error={pinError} onSubmit={(pin) => doEnter(pinFor, pin)} />
        </Modal>
      )}

      {/* ── Yaratish modal ── */}
      {creating && (
        <Modal onClose={() => setCreating(false)}>
          <h2 className="mb-4 text-xl font-bold text-brand-700">{t("add")}</h2>
          <div className="space-y-4">
            <Input
              placeholder={t("name")}
              value={form.display_name}
              onChange={(e) => setForm({ ...form, display_name: e.target.value })}
            />
            <div>
              <p className="mb-1 text-sm text-muted-foreground">{t("ageBand")}</p>
              <div className="flex gap-2">
                {AGE_BANDS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setForm({ ...form, age_band: a })}
                    className={cn(
                      "flex-1 rounded-xl2 border py-2 font-semibold",
                      form.age_band === a
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-input"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1 text-sm text-muted-foreground">{t("avatar")}</p>
              <div className="flex flex-wrap gap-2">
                {AVATARS.map((a) => (
                  <button
                    key={a.key}
                    type="button"
                    aria-label={a.label}
                    onClick={() => setForm({ ...form, avatar_id: a.key })}
                    className={cn(
                      "h-14 w-14 rounded-blob text-3xl",
                      form.avatar_id === a.key ? "bg-brand-100 ring-4 ring-brand-300" : "bg-muted"
                    )}
                  >
                    {a.emoji}
                  </button>
                ))}
              </div>
            </div>
            <Input
              inputMode="numeric"
              maxLength={4}
              placeholder={t("pinOptional")}
              value={form.pin}
              onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })}
            />
            <Button
              size="md"
              className="w-full"
              disabled={!form.display_name || createMut.isPending}
              onClick={() => createMut.mutate()}
            >
              {t("create")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm animate-scale-in rounded-blob bg-card p-6 shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
