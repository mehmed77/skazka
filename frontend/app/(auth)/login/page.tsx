"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button, Input } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { toast } from "@/lib/toast";

export default function LoginPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const login = useAuth((s) => s.login);
  const [loginVal, setLoginVal] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(loginVal, password);
      router.push("/profiles");
    } catch {
      toast.error(t("error"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <h1 className="text-2xl font-bold text-brand-700">{t("loginTitle")}</h1>
      <Input
        placeholder={t("loginField")}
        value={loginVal}
        onChange={(e) => setLoginVal(e.target.value)}
        autoComplete="username"
        required
      />
      <Input
        type="password"
        placeholder={t("password")}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <Button type="submit" size="md" className="w-full" disabled={busy}>
        {t("loginBtn")}
      </Button>
      <Link href="/register" className="block text-center text-sm text-accent">
        {t("noAccount")}
      </Link>
    </form>
  );
}
