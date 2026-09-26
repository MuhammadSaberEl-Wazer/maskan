import Link from "next/link";
import { LoginForm } from "@/components/login-form";
import { demoAccounts } from "@/lib/demo-accounts";
import { getDemoSession, getLocale } from "@/lib/demo-session";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const [{ next }, locale, session] = await Promise.all([searchParams, getLocale(), getDemoSession()]);
  const ar = locale === "ar";

  return (
    <main className="shell py-8 md:py-12">
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">{ar ? "بيئة تجربة آمنة" : "Safe demo environment"}</p>
          <h1 className="mt-2 text-3xl font-bold md:text-4xl">{ar ? "اختر دورك وادخل" : "Choose a role and sign in"}</h1>
          <p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{ar ? "الحسابات دي للعرض فقط، وكل دور بيفتح الصلاحيات والشاشات المناسبة له." : "These accounts are for demonstration only. Each role opens its matching permissions and screens."}</p>
        </div>
        <Link href="/register" className="button-secondary">{ar ? "إنشاء حساب مقيم" : "Create resident account"}</Link>
      </div>
      {session && <div className="mb-5 rounded-md border border-[#bed7c8] bg-[#edf6f0] p-4 text-sm"><strong>{ar ? "أنت داخل حاليًا باسم: " : "Currently signed in as: "}</strong>{ar ? session.fullNameAr : session.fullName}</div>}
      <LoginForm accounts={demoAccounts} locale={locale} nextPath={next} />
    </main>
  );
}
