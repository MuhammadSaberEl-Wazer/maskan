import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { BookingFlow } from "@/components/booking-flow";
import { findSpace, properties } from "@/lib/data";
import { getDemoSession, getLocale, isOperationsRole } from "@/lib/demo-session";
import { pick, propertyName } from "@/lib/i18n";

export const metadata: Metadata = { title: "احجز إقامتك" };

export function generateStaticParams() {
  return properties.flatMap((property) => property.spaces.map((space) => ({ bedId: space.id })));
}

export default async function BookPage({ params }: { params: Promise<{ bedId: string }> }) {
  const [{ bedId }, session, locale] = await Promise.all([params, getDemoSession(), getLocale()]);
  const result = findSpace(bedId);
  if (!result || result.space.availableBeds === 0) notFound();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/book/${bedId}`)}`);
  if (isOperationsRole(session.role)) redirect("/admin");

  return (
    <main className="shell py-7 md:py-10">
      <Link href={`/property/${result.property.slug}`} className="mb-6 inline-flex items-center gap-1 text-sm font-bold text-[var(--muted)] hover:text-[var(--foreground)]"><ChevronLeft className="rtl-flip size-4" />{pick(locale, "رجوع إلى", "Back to")} {propertyName(result.property.slug, result.property.name, locale)}</Link>
      <BookingFlow property={result.property} space={result.space} session={session} locale={locale} />
    </main>
  );
}
