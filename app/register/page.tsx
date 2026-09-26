import Link from "next/link";
import { RegisterForm } from "@/components/register-form";
import { getLocale } from "@/lib/demo-session";

export default async function RegisterPage() {
  const locale = await getLocale();
  const ar = locale === "ar";
  return (
    <main className="shell py-8 md:py-12">
      <RegisterForm locale={locale} />
      <p className="mt-5 text-center text-sm text-[var(--muted)]">{ar ? "عندك حساب تجربة؟" : "Already have a demo account?"} <Link href="/login" className="font-bold text-[var(--brand)]">{ar ? "ادخل من هنا" : "Sign in"}</Link></p>
    </main>
  );
}
