"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/demo-accounts";

export function LanguageSwitch({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const nextLocale = locale === "ar" ? "en" : "ar";

  async function changeLanguage() {
    setPending(true);
    await fetch("/api/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: nextLocale }),
    });
    router.refresh();
    setPending(false);
  }

  return (
    <button
      type="button"
      onClick={changeLanguage}
      disabled={pending}
      className="flex min-h-10 items-center gap-2 rounded-md border border-[#69716c] bg-[#555d58] px-2.5 text-sm font-bold text-white hover:bg-[#48504b] disabled:opacity-50"
      aria-label={locale === "ar" ? "Change language to English" : "تغيير اللغة إلى العربية"}
      title={locale === "ar" ? "English" : "العربية"}
    >
      <span className="text-base leading-none" aria-hidden="true">{locale === "ar" ? "🇪🇬" : "🇬🇧"}</span>
      <span>{locale === "ar" ? "AR" : "EN"}</span>
    </button>
  );
}
