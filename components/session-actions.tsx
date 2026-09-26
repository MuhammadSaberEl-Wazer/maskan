"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@/lib/demo-accounts";

export function LogoutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    const response = await fetch("/api/demo/logout", { method: "POST" });
    const result = (await response.json()) as { redirectTo: string };
    router.push(result.redirectTo);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className="grid size-10 place-items-center rounded-md border border-[#806b64] bg-[#6d5a54] text-white hover:bg-[#5f4d48] disabled:opacity-50"
      title={locale === "ar" ? "تسجيل الخروج" : "Sign out"}
      aria-label={locale === "ar" ? "تسجيل الخروج" : "Sign out"}
    >
      <LogOut className="size-4 text-[#ffe1d6]" aria-hidden="true" />
    </button>
  );
}
