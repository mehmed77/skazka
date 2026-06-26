"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/cn";

// Bolabop 4-raqamli PIN-pad (ulkan tugmalar). 4 raqam yig'ilsa onSubmit chaqiriladi.
export function PinPad({
  onSubmit,
  error,
}: {
  onSubmit: (pin: string) => void;
  error?: boolean;
}) {
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (pin.length === 4) {
      onSubmit(pin);
      setPin("");
    }
  }, [pin, onSubmit]);

  useEffect(() => {
    if (error) setPin("");
  }, [error]);

  const press = (d: string) => setPin((p) => (p.length < 4 ? p + d : p));
  const del = () => setPin((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-3" aria-label="PIN" role="status">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-5 w-5 rounded-full border-2",
              i < pin.length ? "bg-brand-500 border-brand-500" : "border-input"
            )}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => press(d)}
            className="h-20 w-20 rounded-blob bg-muted text-3xl font-bold text-foreground active:scale-95"
          >
            {d}
          </button>
        ))}
        <span />
        <button
          type="button"
          onClick={() => press("0")}
          className="h-20 w-20 rounded-blob bg-muted text-3xl font-bold active:scale-95"
        >
          0
        </button>
        <button
          type="button"
          onClick={del}
          aria-label="o'chirish"
          className="h-20 w-20 rounded-blob text-3xl active:scale-95"
        >
          ⌫
        </button>
      </div>
    </div>
  );
}
