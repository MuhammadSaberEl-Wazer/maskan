import { CheckCircle2, Clock3 } from "lucide-react";
import { getDemoBooking, getDemoSession, getLocale } from "@/lib/demo-session";
import { formatEGP } from "@/lib/format";
import { pick } from "@/lib/i18n";

export default async function PaymentsPage() {
  const [booking, session, locale] = await Promise.all([getDemoBooking(), getDemoSession(), getLocale()]);
  const ownBooking = booking && session && booking.userId === session.accountId ? booking : null;
  const amount = ownBooking?.monthlyPrice ?? 4500;
  const payments = [
    [pick(locale, "إيجار أكتوبر", "October rent"), pick(locale, "١ أكتوبر ٢٠٢٦", "1 Oct 2026"), amount, "due"],
    [pick(locale, "إيجار سبتمبر", "September rent"), pick(locale, "١ سبتمبر ٢٠٢٦", "1 Sep 2026"), amount, "paid"],
    [pick(locale, "وديعة التأمين", "Security deposit"), ownBooking?.moveIn ?? pick(locale, "١ مايو ٢٠٢٦", "1 May 2026"), ownBooking?.depositAmount ?? amount, "held"],
  ] as const;

  return <section className="surface overflow-hidden"><div className="border-b border-[var(--line)] p-5 sm:p-6"><h2 className="text-xl font-bold">{pick(locale, "الدفعات والوديعة", "Payments and deposit")}</h2><p className="mt-2 text-sm text-[var(--muted)]">{pick(locale, "سجل الإيجار ووديعة التأمين المسجلة بشكل منفصل.", "Rent history and the separately tracked security deposit.")}</p></div><div className="divide-y divide-[var(--line)]">{payments.map(([label, date, value, status]) => <div key={label} className="grid grid-cols-[1fr_auto] items-center gap-4 p-5 sm:grid-cols-[1fr_150px_120px]"><div><p className="font-bold">{label}</p><p className="mt-1 text-xs text-[var(--muted)] sm:hidden">{date}</p></div><p className="hidden text-sm text-[var(--muted)] sm:block">{date}</p><div className="text-end"><p className="font-bold">{formatEGP(value, locale)}</p><p className={`mt-1 inline-flex items-center gap-1 text-xs font-bold ${status === "due" ? "text-[var(--warning)]" : "text-[var(--brand)]"}`}>{status === "due" ? <Clock3 className="size-3" /> : <CheckCircle2 className="size-3" />}{status === "due" ? pick(locale, "مستحق", "Due") : status === "paid" ? pick(locale, "مدفوع", "Paid") : pick(locale, "محفوظة", "Held")}</p></div></div>)}</div></section>;
}
