"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BriefcaseBusiness, KeyRound, ShieldCheck, UserRound } from "lucide-react";
import type { DemoAccount, Locale } from "@/lib/demo-accounts";
import { roleLabels } from "@/lib/demo-accounts";
import { areaLabel } from "@/lib/i18n";
import { Input } from "@/components/ui/input";

export function LoginForm({
  accounts,
  locale,
  nextPath,
}: {
  accounts: DemoAccount[];
  locale: Locale;
  nextPath?: string;
}) {
  const router = useRouter();
  const [email, setEmail] = useState("resident@maskan.demo");
  const [password, setPassword] = useState("Maskan123!");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const ar = locale === "ar";

  async function login(payload: { email?: string; password?: string; accountId?: string }) {
    setPendingId(payload.accountId ?? "manual");
    setError(false);
    const response = await fetch("/api/demo/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, next: nextPath }),
    });
    const result = (await response.json()) as { redirectTo?: string };
    if (!response.ok || !result.redirectTo) {
      setError(true);
      setPendingId(null);
      return;
    }
    router.push(result.redirectTo);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <section className="surface h-fit p-6 sm:p-7">
        <p className="eyebrow">{ar ? "دخول يدوي" : "Manual sign in"}</p>
        <h2 className="mt-2 text-2xl font-bold">{ar ? "ادخل على حساب الديمو" : "Sign in to the demo"}</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          {ar
            ? "استخدم أي حساب من الحسابات الموضحة، أو اضغط زر دخول ديمو مباشرة."
            : "Use any listed account, or choose its quick demo sign-in button."}
        </p>
        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            void login({ email, password });
          }}
        >
          <label>
            <span className="mb-2 block text-sm font-bold">{ar ? "البريد الإلكتروني" : "Email"}</span>
            <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} dir="ltr" />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">{ar ? "كلمة المرور" : "Password"}</span>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} dir="ltr" />
          </label>
          {error && <p className="text-sm font-bold text-[var(--danger)]">{ar ? "بيانات الدخول غير صحيحة." : "The sign-in details are incorrect."}</p>}
          <button className="button-primary mt-1" disabled={pendingId !== null}>
            <KeyRound className="size-4" aria-hidden="true" />
            {pendingId === "manual" ? (ar ? "جاري الدخول..." : "Signing in...") : ar ? "دخول" : "Sign in"}
          </button>
        </form>
      </section>

      <section>
        <div className="mb-4">
          <p className="eyebrow">{ar ? "حسابات التجربة" : "Demo accounts"}</p>
          <h2 className="mt-2 text-2xl font-bold">{ar ? "جرّب كل نوع مستخدم" : "Try every user type"}</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {ar ? "كل الحسابات تستخدم كلمة المرور نفسها: " : "All accounts use the same password: "}
            <code className="rounded bg-[#e8ebe8] px-2 py-1 font-bold" dir="ltr">Maskan123!</code>
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {accounts.map((account) => {
            const operations = account.role !== "resident";
            return (
              <article key={account.id} className="surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <span className={`grid size-10 place-items-center rounded-md ${operations ? "bg-[#f6e9e4] text-[var(--terracotta)]" : "bg-[#e9f1ec] text-[var(--brand)]"}`}>
                    {operations ? <BriefcaseBusiness className="size-5" /> : <UserRound className="size-5" />}
                  </span>
                  <span className="rounded bg-[#edf0ed] px-2 py-1 text-xs font-bold">
                    {account.isUnitRepresentative
                      ? ar ? "ممثل وحدة" : "Unit representative"
                      : roleLabels[account.role][locale]}
                  </span>
                </div>
                <h3 className="mt-4 font-bold">{ar ? account.fullNameAr : account.fullName}</h3>
                <div className="mt-3 grid gap-1 text-xs text-[var(--muted)]" dir="ltr">
                  <code>{account.email}</code>
                  <code>{account.password}</code>
                </div>
                {account.area && <p className="mt-3 text-xs font-bold text-[var(--brand)]">{ar ? `النطاق: ${areaLabel(account.area, locale)}` : `Scope: ${account.area}`}</p>}
                <p className="mt-2 text-xs text-[var(--muted)]">
                  {ar ? "لغة الحساب: " : "Account language: "}
                  {account.preferredLanguage === "ar" ? "العربية" : "English"}
                </p>
                <button
                  type="button"
                  onClick={() => void login({ accountId: account.id })}
                  disabled={pendingId !== null}
                  className="button-secondary mt-5 w-full"
                >
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {pendingId === account.id ? (ar ? "جاري الدخول..." : "Signing in...") : ar ? "دخول ديمو" : "Demo sign in"}
                  <ArrowRight className="rtl-flip size-4" aria-hidden="true" />
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
