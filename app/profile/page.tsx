import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, Building2, Cctv, Languages, Mail, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { cameraAccessLevel } from "@/lib/cameras";
import { properties } from "@/lib/data";
import { roleLabels } from "@/lib/demo-accounts";
import { getDemoBooking, getDemoSession, getLocale, isOperationsRole } from "@/lib/demo-session";
import { areaLabel, pick, propertyName } from "@/lib/i18n";

export const metadata: Metadata = { title: "الملف الشخصي" };

export default async function ProfilePage() {
  const [session, booking, locale] = await Promise.all([getDemoSession(), getDemoBooking(), getLocale()]);
  if (!session) redirect("/login?next=/profile");
  const ar = locale === "ar";
  const operations = isOperationsRole(session.role);
  const ownBooking = booking?.userId === session.accountId ? booking : null;
  const residence = session.role === "resident" ? properties.find((property) => property.slug === (ownBooking?.propertySlug ?? (!session.registeredInDemo ? "nasr-city-park" : ""))) : undefined;
  const role = session.isUnitRepresentative ? pick(locale, "ممثل وحدة", "Unit representative") : roleLabels[session.role][locale];
  const scope = residence ? propertyName(residence.slug, residence.name, locale) : session.area ? areaLabel(session.area, locale) : operations ? pick(locale, "كل محفظة مسكن", "Entire Maskan portfolio") : pick(locale, "بدون إقامة مرتبطة", "No linked stay");
  const initials = (ar ? session.fullNameAr : session.fullName).split(" ").map((part) => part[0]).slice(0, 2).join("");

  return (
    <main className="shell py-8 md:py-12">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 sm:flex-row sm:items-center"><div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#252725] text-2xl font-bold text-white">{initials}</div><div className="min-w-0"><p className="eyebrow">{pick(locale, "الملف الشخصي", "Profile")}</p><h1 className="mt-2 text-3xl font-bold">{ar ? session.fullNameAr : session.fullName}</h1><p className="mt-2 flex items-center gap-2 text-sm text-[var(--muted)]"><BadgeCheck className="size-4 text-[var(--brand)]" />{role} · {pick(locale, `مستوى وصول ${cameraAccessLevel(session)} من ٥`, `Access level ${cameraAccessLevel(session)} of 5`)}</p></div></div>

      <div className="grid gap-8 py-8 lg:grid-cols-[1fr_320px] lg:gap-14"><section><h2 className="text-xl font-bold">{pick(locale, "بيانات الحساب", "Account details")}</h2><dl className="mt-5 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2"><div className="bg-white p-5"><dt className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><UserRound className="size-4" />{pick(locale, "الاسم", "Name")}</dt><dd className="mt-2 font-bold">{ar ? session.fullNameAr : session.fullName}</dd></div><div className="bg-white p-5"><dt className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><Mail className="size-4" />{pick(locale, "البريد", "Email")}</dt><dd className="mt-2 truncate font-bold" dir="ltr">{session.email}</dd></div><div className="bg-white p-5"><dt className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><Languages className="size-4" />{pick(locale, "لغة الحساب", "Account language")}</dt><dd className="mt-2 font-bold">{session.language === "ar" ? "العربية" : "English"}</dd></div><div className="bg-white p-5"><dt className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><MapPin className="size-4" />{pick(locale, "نطاق الحساب", "Account scope")}</dt><dd className="mt-2 font-bold">{scope}</dd></div></dl><div className="mt-6 flex items-start gap-3 border-s-2 border-[var(--brand)] ps-4 text-sm leading-6 text-[var(--muted)]"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" />{pick(locale, "بيانات الحساب والصلاحيات هنا تجريبية وموقعة داخل جلسة الديمو. الإنتاج يحتاج Supabase Auth وسياسات RLS وسجل تدقيق.", "Account details and permissions are signed demo-session data. Production requires Supabase Auth, RLS policies, and an audit trail.")}</div></section><aside className="grid content-start gap-3"><Link href={operations ? "/admin#cameras" : "/my-maskan#cameras"} className="surface card-hover flex items-center gap-4 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f3e8e4] text-[var(--terracotta)]"><Cctv className="size-5" /></span><span><strong className="block text-sm">{pick(locale, "الكاميرات ضمن الإقامة", "Cameras inside your space")}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{pick(locale, "ليست صفحة منفصلة", "Embedded, not a separate page")}</span></span></Link><Link href={operations ? "/admin" : "/my-maskan"} className="surface card-hover flex items-center gap-4 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#f2f4f1]"><Building2 className="size-5" /></span><span><strong className="block text-sm">{operations ? pick(locale, "لوحة التشغيل", "Operations dashboard") : pick(locale, "مسكني", "My Maskan")}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{pick(locale, "ارجع لمساحة حسابك", "Return to your account area")}</span></span></Link></aside></div>
    </main>
  );
}
