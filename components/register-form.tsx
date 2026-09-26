"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";
import type { Locale } from "@/lib/demo-accounts";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function RegisterForm({ locale }: { locale: Locale }) {
  const router = useRouter();
  const ar = locale === "ar";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(false);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/demo/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    const result = (await response.json()) as { redirectTo?: string };
    if (!response.ok || !result.redirectTo) {
      setError(true);
      setPending(false);
      return;
    }
    router.push(result.redirectTo);
    router.refresh();
  }

  return (
    <form className="surface mx-auto max-w-2xl p-6 sm:p-8" onSubmit={submit}>
      <p className="eyebrow">{ar ? "حساب مقيم تجريبي" : "Demo resident account"}</p>
      <h1 className="mt-2 text-3xl font-bold">{ar ? "اعمل حسابك" : "Create your account"}</h1>
      <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
        {ar
          ? "الحساب يعمل داخل جلسة الديمو الحالية فقط، ولا يتم حفظ بياناتك في قاعدة بيانات."
          : "This account works for the current demo session only and is not persisted in a database."}
      </p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">{ar ? "الاسم بالكامل" : "Full name"}</span><Input name="fullName" required /></label>
        <label><span className="mb-2 block text-sm font-bold">{ar ? "البريد الإلكتروني" : "Email"}</span><Input name="email" type="email" dir="ltr" required /></label>
        <label><span className="mb-2 block text-sm font-bold">{ar ? "كلمة المرور" : "Password"}</span><Input name="password" type="password" dir="ltr" minLength={8} required /></label>
        <label><span className="mb-2 block text-sm font-bold">{ar ? "النوع" : "Gender"}</span><Select name="gender" defaultValue="male" required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="male">{ar ? "ذكر" : "Male"}</SelectItem><SelectItem value="female">{ar ? "أنثى" : "Female"}</SelectItem></SelectContent></Select></label>
        <label><span className="mb-2 block text-sm font-bold">{ar ? "لغة الحساب" : "Account language"}</span><Select name="language" defaultValue={locale} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ar">العربية</SelectItem><SelectItem value="en">English</SelectItem></SelectContent></Select></label>
      </div>
      {error && <p className="mt-4 text-sm font-bold text-[var(--danger)]">{ar ? "راجع البيانات وحاول تاني." : "Check the details and try again."}</p>}
      <button className="button-primary mt-6 w-full" disabled={pending}><UserPlus className="size-4" />{pending ? (ar ? "جاري إنشاء الحساب..." : "Creating account...") : ar ? "إنشاء حساب ديمو" : "Create demo account"}</button>
    </form>
  );
}
