import { Clock3 } from "lucide-react";
import { MaintenanceForm } from "@/components/maintenance-form";
import { getDemoMaintenance, getDemoSession, getLocale } from "@/lib/demo-session";
import { pick } from "@/lib/i18n";

export default async function MaintenancePage() {
  const [request, session, locale] = await Promise.all([getDemoMaintenance(), getDemoSession(), getLocale()]);
  const ownRequest = request && session && request.userId === session.accountId ? request : null;
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <MaintenanceForm locale={locale} />
      <aside className="surface h-fit p-5">
        <div className="flex items-center justify-between gap-3"><h2 className="font-bold">{ownRequest?.title ?? pick(locale, "تسريب في حوض المطبخ", "Kitchen sink leak")}</h2><span className="rounded bg-[#fff0d9] px-2 py-1 text-xs font-bold text-[var(--warning)]">{ownRequest ? pick(locale, "تم الاستلام", "Submitted") : pick(locale, "تم التعيين", "Assigned")}</span></div>
        <p className="mt-2 text-sm leading-6 text-[var(--muted)]" dir="ltr">{ownRequest?.reference ?? "MR-2026-0138"}</p>
        <ol className="mt-5 grid gap-0 text-sm">{[pick(locale, "تم الاستلام", "Submitted"), pick(locale, "تم التعيين", "Assigned"), pick(locale, "جاري التنفيذ", "In progress"), pick(locale, "تم الحل", "Resolved")].map((item, index) => { const complete = ownRequest ? index === 0 : index < 2; return <li key={item} className="flex min-h-12 gap-3"><span className={`mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border ${complete ? "border-[var(--brand)] bg-[var(--brand)] text-white" : "border-[var(--line)] bg-white"}`}>{complete ? "✓" : ""}</span><span className={complete ? "font-bold" : "text-[var(--muted)]"}>{item}</span></li>; })}</ol>
        <p className="mt-2 flex gap-2 rounded-md bg-[#f2f4f1] p-3 text-xs leading-5 text-[var(--muted)]"><Clock3 className="mt-0.5 size-3.5 shrink-0" />{ownRequest ? pick(locale, "فريق التشغيل هيراجع الطلب ويعيّن الفني.", "Operations will review the request and assign a technician.") : pick(locale, "زيارة الفني: اليوم من ٤ لـ٦ مساءً", "Technician visit: today, 4:00–6:00 PM")}</p>
      </aside>
    </div>
  );
}
