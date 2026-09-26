import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowUpRight, Banknote, BedDouble, Building2, CalendarClock, Cctv, CircleDollarSign, Clock3, Gauge, MapPinned, MessageSquareText, Wrench } from "lucide-react";
import { CameraWall } from "@/components/camera-wall";
import { cameraAccessLevel, camerasForProperties } from "@/lib/cameras";
import { properties, stats } from "@/lib/data";
import { roleLabels } from "@/lib/demo-accounts";
import { getDemoBooking, getDemoChats, getDemoMaintenance, getDemoSession, getLocale, isOperationsRole } from "@/lib/demo-session";
import { formatEGP } from "@/lib/format";
import { areaLabel, pick, propertyName, rentalModelLabel, tierLabel } from "@/lib/i18n";

export const metadata: Metadata = { title: "لوحة التشغيل" };

export default async function Admin() {
  const [session, locale, demoBooking, demoMaintenance, demoChats] = await Promise.all([getDemoSession(), getLocale(), getDemoBooking(), getDemoMaintenance(), getDemoChats()]);
  if (!session) redirect("/login?next=/admin");
  if (!isOperationsRole(session.role)) redirect("/my-maskan");
  const ar = locale === "ar";
  const canSeeFinance = session.role === "admin" || session.role === "area_manager";
  const visibleProperties = session.area ? properties.filter((property) => property.area === session.area) : properties;
  const scopedInventory = visibleProperties.reduce((total, property) => total + property.totalBeds, 0);
  const scopedOccupied = visibleProperties.reduce((total, property) => total + property.occupiedBeds, 0);
  const scopedOccupancy = Math.round((scopedOccupied / scopedInventory) * 100);
  const scopedAreas = new Set(visibleProperties.map((property) => property.area)).size;

  const kpis = [
    { label: pick(locale, "الوحدات المُدارة", "Managed properties"), value: String(visibleProperties.length), note: session.area ? areaLabel(session.area, locale) : pick(locale, `في ${scopedAreas} مناطق بالقاهرة الكبرى`, `Across ${scopedAreas} Greater Cairo areas`), icon: Building2 },
    { label: pick(locale, "إشغال المحفظة", "Portfolio occupancy"), value: `${scopedOccupancy}%`, note: `${scopedOccupied} / ${scopedInventory} ${pick(locale, "مكان أو وحدة حجز", "inventory slots")}`, icon: Gauge },
    canSeeFinance
      ? { label: pick(locale, "الإيجار الشهري", "Monthly rent"), value: formatEGP(session.area ? 112000 : stats.revenue, locale), note: pick(locale, "بيانات توضيحية", "Illustrative data"), icon: Banknote }
      : { label: pick(locale, "المخزون المتاح", "Available inventory"), value: String(visibleProperties.reduce((total, property) => total + property.available, 0)), note: pick(locale, "غرف أو وحدات جاهزة للحجز", "Rooms or units ready to book"), icon: BedDouble },
    canSeeFinance
      ? { label: pick(locale, "المتأخرات", "Outstanding"), value: formatEGP(session.area ? 11800 : stats.outstandingAmount, locale), note: pick(locale, "تحتاج متابعة", "Needs follow-up"), icon: CircleDollarSign }
      : { label: pick(locale, "طلبات الصيانة", "Open maintenance"), value: String(stats.maintenance), note: pick(locale, "ضمن قائمة التشغيل", "In operations queue"), icon: Wrench },
  ];

  const baseMaintenance = [
    ["MR-0138", pick(locale, "تسريب حوض المطبخ", "Kitchen sink leak"), "MSK-NS-001", pick(locale, "تم التعيين", "Assigned")],
    ["MR-0137", pick(locale, "تكييف الأوضة مش بيبرد", "Bedroom AC not cooling"), "MSK-NC-004", pick(locale, "جاري التنفيذ", "In progress")],
    ["MR-0135", pick(locale, "الواي فاي ضعيف", "Weak Wi-Fi"), "MSK-SH-001", pick(locale, "تم الاستلام", "Submitted")],
  ];
  const maintenanceRows = demoMaintenance
    ? [[demoMaintenance.reference, demoMaintenance.title, pick(locale, "طلب من حساب الديمو", "Demo account request"), pick(locale, "تم الاستلام", "Submitted")], ...baseMaintenance]
    : baseMaintenance;
  const supportMessages = Object.values(demoChats.support)
    .flat()
    .filter((message) => message.authorType === "resident" && (!session.area || message.area === session.area))
    .slice(-3)
    .reverse();
  const operationsCameras = camerasForProperties(visibleProperties, cameraAccessLevel(session));

  return (
    <main className="shell py-7 md:py-10">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="eyebrow">{pick(locale, "تشغيل المحفظة", "Portfolio operations")}</p><h1 className="mt-2 text-3xl font-bold">{pick(locale, "أهلًا", "Welcome")}, {ar ? session.fullNameAr : session.fullName}</h1><p className="mt-2 text-sm text-[var(--muted)]">{roleLabels[session.role][locale]}{session.area ? ` · ${areaLabel(session.area, locale)}` : ` · ${pick(locale, "محفظة مسكن في مصر", "Maskan Egypt portfolio")}`}</p></div>
        <div className="rounded-md border border-[#dfc796] bg-[#fff6e4] px-4 py-3 text-xs font-bold text-[#815714]">{pick(locale, "بيانات POC تجريبية وليست أداءً فعليًا للشركة", "Illustrative POC data, not actual company performance")}</div>
      </header>

      <nav className="mt-7 flex gap-1 overflow-x-auto border-b border-[var(--line)]" aria-label={pick(locale, "أقسام التشغيل", "Operations sections")}>{[pick(locale, "نظرة عامة", "Overview"), pick(locale, "العقارات", "Properties"), pick(locale, "المقيمون", "Residents"), pick(locale, "الحجوزات", "Bookings"), pick(locale, "الدفعات", "Payments"), pick(locale, "الصيانة", "Maintenance")].map((item, index) => <a key={item} href={index === 0 ? "#overview" : index === 1 ? "#properties" : index === 5 ? "#maintenance" : "#activity"} className={`min-h-11 shrink-0 border-b-2 px-3 text-sm font-bold ${index === 0 ? "border-[var(--brand)] text-[var(--brand)]" : "border-transparent text-[var(--muted)] hover:text-[var(--foreground)]"}`}>{item}</a>)}</nav>

      <section id="overview" className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{kpis.map(({ label, value, note, icon: Icon }) => <article key={label} className="surface p-5"><div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-md bg-[#eef3ef] text-[var(--brand)]"><Icon className="size-5" /></span><span className="flex items-center gap-1 text-xs font-bold text-[var(--brand)]"><ArrowUpRight className="size-3.5" />{pick(locale, "تجريبي", "Demo")}</span></div><p className="mt-5 text-2xl font-bold">{value}</p><p className="mt-1 text-sm font-bold">{label}</p><p className="mt-1 text-xs text-[var(--muted)]">{note}</p></article>)}</section>

      <section id="activity" className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <article className="surface p-5 sm:p-6"><p className="eyebrow">{pick(locale, "آخر حركة في دورة الديمو", "Latest demo-cycle activity")}</p><h2 className="mt-2 text-xl font-bold">{pick(locale, "الحجز والخدمة مرتبطين بالحسابات", "Booking and service are linked to accounts")}</h2><div className="mt-6 grid gap-3">
          <div className="flex items-start gap-4 rounded-md bg-[#f3f5f2] p-4"><CalendarClock className="mt-0.5 size-5 shrink-0 text-[var(--brand)]" /><div><p className="font-bold">{demoBooking ? pick(locale, `حجز جديد: ${demoBooking.reference}`, `New booking: ${demoBooking.reference}`) : pick(locale, "لا يوجد حجز جديد في الجلسة", "No new booking in this session")}</p><p className="mt-1 text-sm text-[var(--muted)]">{demoBooking ? `${demoBooking.propertyCode} · ${formatEGP(demoBooking.monthlyPrice, locale)} · ${demoBooking.duration} ${pick(locale, "شهور", "months")}` : pick(locale, "ادخل بحساب مقيم وأكمل حجز ديمو ثم ارجع بحساب إدارة.", "Sign in as a resident, complete a demo booking, then return with an operations account.")}</p></div></div>
          <div className="flex items-start gap-4 rounded-md bg-[#f3f5f2] p-4"><Wrench className="mt-0.5 size-5 shrink-0 text-[var(--terracotta)]" /><div><p className="font-bold">{demoMaintenance ? pick(locale, `طلب صيانة: ${demoMaintenance.reference}`, `Maintenance request: ${demoMaintenance.reference}`) : pick(locale, "لا يوجد طلب صيانة جديد", "No new maintenance request")}</p><p className="mt-1 text-sm text-[var(--muted)]">{demoMaintenance?.title ?? pick(locale, "طلبات المقيمين الجديدة هتظهر هنا.", "New resident requests appear here.")}</p></div></div>
        </div></article>
        <aside className="grid gap-5"><article className="surface p-5"><div className="flex items-center justify-between"><h2 className="font-bold">{pick(locale, "محتاج اهتمام النهارده", "Today's attention")}</h2><AlertTriangle className="size-5 text-[var(--warning)]" /></div><div className="mt-5 grid gap-4">{canSeeFinance ? <div className="flex gap-3"><CircleDollarSign className="size-5 text-[var(--warning)]" /><div><p className="text-sm font-bold">{pick(locale, "دفعتان دخلوا المتأخرات", "2 payments became overdue")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "قائمة المتابعة اتحدثت", "Follow-up queue updated")}</p></div></div> : <div className="flex gap-3"><Wrench className="size-5 text-[var(--warning)]" /><div><p className="text-sm font-bold">{pick(locale, "طلب صيانة عاجل", "1 urgent maintenance item")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "الفني في الطريق", "Technician is on the way")}</p></div></div>}<div className="flex gap-3"><CalendarClock className="size-5 text-[var(--brand)]" /><div><p className="text-sm font-bold">{pick(locale, "٣ حالات انتقال للسكن الأسبوع ده", "3 move-ins this week")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "كل الأوض والوحدات جاهزة", "All rooms and units are ready")}</p></div></div></div></article><article className="rounded-lg bg-[var(--brand-dark)] p-5 text-white"><MapPinned className="size-5 text-[var(--accent)]" /><p className="mt-5 text-xs font-bold uppercase tracking-[0.06em] text-white/55">{pick(locale, "إشارة كثافة", "Cluster signal")}</p><h2 className="mt-2 text-lg font-bold">{pick(locale, "القاهرة الجديدة أكبر تجمع تجريبي", "New Cairo is the largest demo cluster")}</h2><p className="mt-2 text-sm leading-6 text-white/65">{pick(locale, "٥ وحدات مشتركة وأسرية في نطاق واحد تساعد على اختبار كفاءة التشغيل والصيانة.", "Five shared and family properties in one cluster help test operating and maintenance efficiency.")}</p></article></aside>
      </section>

      <section id="maintenance" className="surface mt-5 overflow-hidden"><div className="border-b border-[var(--line)] p-5"><p className="eyebrow">{pick(locale, "قائمة الخدمة", "Service queue")}</p><h2 className="mt-1 text-xl font-bold">{pick(locale, "الصيانة المفتوحة", "Open maintenance")}</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[650px] text-start text-sm"><thead className="bg-[#f4f5f3] text-xs text-[var(--muted)]"><tr><th className="px-5 py-3 font-bold">{pick(locale, "الطلب", "Request")}</th><th className="px-4 py-3 font-bold">{pick(locale, "المشكلة", "Issue")}</th><th className="px-4 py-3 font-bold">{pick(locale, "الوحدة", "Property")}</th><th className="px-5 py-3 font-bold">{pick(locale, "الحالة", "Status")}</th></tr></thead><tbody className="divide-y divide-[var(--line)]">{maintenanceRows.map(([id, issue, property, status]) => <tr key={id}><td className="px-5 py-4 font-bold" dir="ltr">{id}</td><td className="px-4 py-4">{issue}</td><td className="px-4 py-4 text-[var(--muted)]">{property}</td><td className="px-5 py-4"><span className="rounded bg-[#fff0d9] px-2 py-1 text-xs font-bold text-[var(--warning)]">{status}</span></td></tr>)}</tbody></table></div></section>

      <section className="surface mt-5 overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-[var(--line)] p-5"><div><p className="eyebrow">{pick(locale, "دعم المقيمين", "Resident support")}</p><h2 className="mt-1 text-xl font-bold">{pick(locale, "أحدث رسائل الدعم الخاصة", "Latest private support messages")}</h2></div><MessageSquareText className="size-5 text-[var(--brand)]" /></div>
        {supportMessages.length ? <div className="divide-y divide-[var(--line)]">{supportMessages.map((message) => <article key={message.id} className="grid gap-3 p-5 sm:grid-cols-[180px_1fr_auto]"><strong className="text-sm">{message.authorName}</strong><div><p className="text-sm leading-6 text-[var(--muted)]">{message.text || pick(locale, "مرفق بدون نص", "Attachment without text")}</p>{message.attachments?.length ? <div className="mt-3 flex flex-wrap gap-2">{message.attachments.map((attachment) => attachment.kind === "image" ? <a key={attachment.id} href={attachment.url} target="_blank" rel="noreferrer"><img src={attachment.url} alt={attachment.name} className="h-24 w-32 rounded-md object-cover" /></a> : <video key={attachment.id} src={attachment.url} controls preload="metadata" className="h-24 w-40 rounded-md bg-black" aria-label={attachment.name} />)}</div> : null}</div><time className="text-xs text-[var(--muted)]" dateTime={message.createdAt}>{new Intl.DateTimeFormat(ar ? "ar-EG" : "en-EG", { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time></article>)}</div> : <p className="p-5 text-sm text-[var(--muted)]">{pick(locale, "لا توجد رسائل دعم جديدة في جلسة الديمو.", "There are no new support messages in this demo session.")}</p>}
      </section>

      <section id="cameras" className="scroll-mt-24 border-y border-[var(--line)] py-7">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="eyebrow">{pick(locale, "ضمن لوحة التشغيل", "Inside operations")}</p><h2 className="mt-1 flex items-center gap-2 text-xl font-bold"><Cctv className="size-5 text-[var(--brand)]" />{pick(locale, "كاميرات المساحات المشتركة", "Shared-area cameras")}</h2><p className="mt-2 text-sm text-[var(--muted)]">{pick(locale, "اختر الوحدة داخل نطاق حسابك. لا توجد صفحة كاميرات منفصلة.", "Choose a residence inside your assigned scope. Cameras are not a separate workspace.")}</p></div><span className="text-xs font-bold text-[var(--muted)]">{operationsCameras.length} {pick(locale, "نقطة مصرح بها", "authorized feeds")}</span></div>
        <CameraWall cameras={operationsCameras} locale={locale} defaultToFirstProperty />
      </section>

      <section id="properties" className="surface mt-5 overflow-hidden"><div className="flex items-center justify-between border-b border-[var(--line)] p-5"><div><p className="eyebrow">{pick(locale, "المخزون المُدار", "Managed inventory")}</p><h2 className="mt-1 text-xl font-bold">{pick(locale, "أداء العقارات", "Property performance")}</h2></div><span className="text-xs font-bold text-[var(--muted)]">{visibleProperties.length} {pick(locale, "وحدة ديمو", "demo properties")}</span></div><div className="overflow-x-auto"><table className="w-full min-w-[880px] text-start text-sm"><thead className="bg-[#f4f5f3] text-xs text-[var(--muted)]"><tr><th className="px-5 py-3 font-bold">{pick(locale, "الوحدة", "Unit")}</th><th className="px-4 py-3 font-bold">{pick(locale, "المنطقة", "Area")}</th><th className="px-4 py-3 font-bold">{pick(locale, "نوع التأجير", "Rental model")}</th><th className="px-4 py-3 font-bold">{pick(locale, "المستوى", "Tier")}</th><th className="px-4 py-3 font-bold">{pick(locale, "المخزون", "Inventory")}</th><th className="px-4 py-3 font-bold">{pick(locale, "الإشغال", "Occupancy")}</th>{canSeeFinance && <th className="px-5 py-3 font-bold">{pick(locale, "الإيجار الشهري", "Monthly rent")}</th>}</tr></thead><tbody className="divide-y divide-[var(--line)]">{visibleProperties.map((property) => { const occupancy = Math.round((property.occupiedBeds / property.totalBeds) * 100); const family = property.rentalModel === "Family apartment"; return <tr key={property.id}><td className="px-5 py-4"><p className="font-bold" dir="ltr">{property.code}</p><p className="mt-1 text-xs text-[var(--muted)]">{propertyName(property.slug, property.name, locale)}</p></td><td className="px-4 py-4">{areaLabel(property.area, locale)}</td><td className="px-4 py-4"><span className={`rounded px-2 py-1 text-xs font-bold ${family ? "bg-[#f0d8cf] text-[#76351f]" : "bg-[#edf0ed]"}`}>{rentalModelLabel(property.rentalModel, locale)}</span></td><td className="px-4 py-4"><span className="rounded bg-[#edf0ed] px-2 py-1 text-xs font-bold">{tierLabel(property.type, locale)}</span></td><td className="px-4 py-4"><span className="inline-flex items-center gap-2"><BedDouble className="size-4 text-[var(--muted)]" />{property.occupiedBeds}/{property.totalBeds} {family ? pick(locale, "وحدة", "unit") : pick(locale, "سرير", "beds")}</span></td><td className="px-4 py-4"><div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded bg-[#e8ebe8]"><div className="h-full rounded bg-[var(--brand)]" style={{ width: `${occupancy}%` }} /></div><span className="font-bold">{occupancy}%</span></div></td>{canSeeFinance && <td className="px-5 py-4"><p className="font-bold">{formatEGP(property.price, locale)}</p><p className="mt-1 text-xs text-[var(--muted)]">{family ? pick(locale, "للوحدة بالكامل", "whole unit") : pick(locale, "يبدأ من", "starting from")}</p></td>}</tr>; })}</tbody></table></div></section>

      <footer className="mt-5 flex items-center gap-2 text-xs text-[var(--muted)]"><Clock3 className="size-3.5" />{pick(locale, "لقطة لوحة الديمو · ٢٦ سبتمبر ٢٠٢٦", "Demo dashboard snapshot · 26 September 2026")}</footer>
    </main>
  );
}
