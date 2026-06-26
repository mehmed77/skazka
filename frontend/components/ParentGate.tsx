"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui";

// Parent Gate (SPEC §7.4): bolani ota-ona zonasidan (sozlama/xarid) to'sadi.
// PIN'dan FARQLI — bu kattalar tekshiruvi (oddiy matematik misol).
export function ParentGate({ children }: { children: React.ReactNode }) {
  const t = useTranslations("gate");
  const [passed, setPassed] = useState(false);
  const [q] = useState(() => ({
    a: Math.floor(Math.random() * 5) + 3,
    b: Math.floor(Math.random() * 5) + 2,
  }));
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  if (passed) return <>{children}</>;

  const check = () => {
    if (Number(val) === q.a + q.b) setPassed(true);
    else {
      setErr(true);
      setVal("");
    }
  };

  return (
    <div className="mx-auto mt-16 max-w-sm rounded-blob bg-card p-8 text-center shadow-soft">
      <h2 className="text-xl font-bold text-brand-700">🔒 {t("title")}</h2>
      <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
      <p className="my-5 text-3xl font-extrabold">
        {q.a} + {q.b} = ?
      </p>
      <input
        type="number"
        inputMode="numeric"
        aria-label={t("answer")}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && check()}
        className="w-28 rounded-xl2 border border-input bg-background p-3 text-center text-2xl"
      />
      <div className="mt-5">
        <Button size="md" onClick={check}>
          {t("confirm")}
        </Button>
      </div>
      {err && <p className="mt-3 text-sm text-red-500">{t("wrong")}</p>}
    </div>
  );
}
