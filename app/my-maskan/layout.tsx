import { ResidentNav } from "@/components/resident-nav";
import { redirect } from "next/navigation";
import { getDemoSession, getLocale, isOperationsRole } from "@/lib/demo-session";

export default async function MyMaskanLayout({ children }: { children: React.ReactNode }) {
  const [session, locale] = await Promise.all([getDemoSession(), getLocale()]);
  if (!session) redirect("/login?next=/my-maskan");
  if (isOperationsRole(session.role)) redirect("/admin");
  const ar = locale === "ar";
  return (
    <main className="shell max-w-[1100px] py-7 md:py-10">
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="eyebrow">{ar ? "بوابة المقيم · حساب تجريبي" : "Resident portal · Demo profile"}</p>
          <h1 className="mt-2 text-3xl font-bold">{ar ? "مسكني" : "My Maskan"}</h1>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-bold">{ar ? session.fullNameAr : session.fullName}</p>
          <p className="text-xs text-[var(--muted)]">{session.isUnitRepresentative ? (ar ? "مقيم · ممثل وحدة" : "Resident · Unit representative") : ar ? "حساب مقيم" : "Resident account"}</p>
        </div>
      </div>
      <ResidentNav locale={locale} />
      {children}
    </main>
  );
}
