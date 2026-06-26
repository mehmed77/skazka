"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { toast } from "@/lib/toast";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const register = useAuth((s) => s.register);
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register({ phone, full_name: fullName, password });
      router.push("/profiles");
    } catch {
      toast.error(t("registerError"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-700">{t("registerTitle")}</h1>
      <Input
        placeholder={t("fullName")}
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        autoComplete="name"
      />
      <Input
        placeholder={t("phone")}
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        autoComplete="tel"
        required
      />
      <Input
        type="password"
        placeholder={t("password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        minLength={6}
        required
      />
      <Button type="submit" size="md" className="w-full" disabled={busy}>
        {t("registerBtn")}
      </Button>
      <Link href="/login" className="block text-center text-sm text-accent">
        {t("haveAccount")}
      </Link>
    </form>
  );
}
