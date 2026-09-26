import Link from "next/link";
import { ArrowRight, CalendarCheck, Cctv, CheckCircle2, Clock3, CreditCard, FileText, House, LifeBuoy, MapPin, MessageCircle, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { CameraWall } from "@/components/camera-wall";
import { cameraAccessLevel, camerasForProperties } from "@/lib/cameras";
import { getDemoBooking, getDemoSession, getLocale } from "@/lib/demo-session";
import { properties } from "@/lib/data";
import { formatEGP } from "@/lib/format";
import { areaLabel, neighborhoodLabel, pick, propertyName } from "@/lib/i18n";

export default async function MyMaskan() {
  const [session, storedBooking, locale] = await Promise.all([getDemoSession(), getDemoBooking(), getLocale()]);
  if (!session) return null;
  const ar = locale === "ar";
  const booking = storedBooking?.userId === session.accountId ? storedBooking : null;
  const hasDefaultStay = !session.registeredInDemo;
  const property = booking
    ? properties.find((item) => item.slug === booking.propertySlug)
    : hasDefaultStay
      ? properties.find((item) => item.slug === "nasr-city-park")
      : undefined;
  const monthlyPrice = booking?.monthlyPrice ?? 4500;
  const deposit = booking?.depositAmount ?? 4500;
  const room = booking?.roomCode ?? "Room B";
  const bed = booking?.bedCode ?? "B1";

  if (!property) {
    return (
      <section className="surface grid min-h-80 place-items-center p-8 text-center"><div><House className="mx-auto size-10 text-[var(--brand)]" /><h2 className="mt-5 text-2xl font-bold">{pick(locale, "لسه ما حجزتش إقامتك", "You have not booked a stay yet")}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{pick(locale, "دور على الوحدة المناسبة واختار الأوضة أو السرير، وبعد تأكيد حجز الديمو هتلاقي كل التفاصيل هنا.", "Find a suitable residence and choose a room or bed. Your confirmed demo booking will appear here.")}</p><Link href="/explore" className="button-primary mt-6">{pick(locale, "دور على سكن", "Find a residence")}<ArrowRight className="rtl-flip size-4" /></Link></div></section>
    );
  }

  const actions = [
    { href: "/my-maskan/maintenance", label: pick(locale, "بلّغ عن مشكلة", "Report an issue"), note: pick(locale, "تابع طلبات الصيانة", "Track maintenance"), icon: Wrench },
    { href: "/my-maskan/payments", label: pick(locale, "سجل الدفعات", "Payment history"), note: pick(locale, "الإيصالات والمستحقات", "Receipts and dues"), icon: CreditCard },
    { href: "/my-maskan/contract", label: pick(locale, "شوف العقد", "View contract"), note: pick(locale, "بيانات العقد التجريبي", "Demo contract details"), icon: FileText },
    { href: "/my-maskan/chat", label: pick(locale, "شات الوحدة", "Unit chat"), note: pick(locale, "تواصل مع سكان وحدتك", "Talk with your residents"), icon: MessageCircle },
    { href: "/my-maskan/support", label: pick(locale, "كلم الدعم", "Contact support"), note: pick(locale, "فريق مسكن معاك", "The Maskan team is here"), icon: LifeBuoy },
  ];
  const residentCameras = camerasForProperties([property], cameraAccessLevel(session));

  return (
    <div className="grid gap-5 lg:grid-cols-[1.45fr_.8fr]">
      <div className="grid gap-5">
        {booking && <div className="rounded-md border border-[#bed7c8] bg-[#edf6f0] p-4 text-sm"><strong>{pick(locale, "آخر حركة: ", "Latest activity: ")}</strong>{pick(locale, `تم حفظ الحجز ${booking.reference} وربطه بالحساب.`, `Booking ${booking.reference} was saved and linked to this account.`)}</div>}
        <section className="surface overflow-hidden">
          <div className="bg-[var(--brand)] p-6 text-white sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--accent)]">{pick(locale, "إقامتك الحالية", "Current stay")}</p><h2 className="mt-2 text-2xl font-bold">{propertyName(property.slug, property.name, locale)}</h2><p className="mt-2 flex items-center gap-2 text-sm text-white/70"><MapPin className="size-4" />{neighborhoodLabel(property.neighborhood, locale)}، {areaLabel(property.area, locale)}</p></div><span className="rounded bg-white/10 px-3 py-1.5 text-xs font-bold" dir="ltr">{property.code}</span></div><div className="mt-7 grid grid-cols-2 gap-4 border-t border-white/15 pt-5 sm:grid-cols-4"><div><p className="text-xs text-white/60">{pick(locale, "الأوضة", "Room")}</p><p className="mt-1 font-bold">{ar ? room.replace("Room", "أوضة") : room} · {bed}</p></div><div><p className="text-xs text-white/60">{pick(locale, "المستوى", "Tier")}</p><p className="mt-1 font-bold">{property.type}</p></div><div><p className="text-xs text-white/60">{pick(locale, "بداية السكن", "Move-in")}</p><p className="mt-1 font-bold">{booking?.moveIn ?? pick(locale, "١ مايو ٢٠٢٦", "1 May 2026")}</p></div><div><p className="text-xs text-white/60">{pick(locale, "مدة الإقامة", "Stay length")}</p><p className="mt-1 font-bold">{booking ? `${booking.duration} ${pick(locale, "شهور", "months")}` : pick(locale, "١٢ شهر", "12 months")}</p></div></div></div>
          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2"><div className="bg-white p-5"><p className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><CreditCard className="size-4" />{pick(locale, "الدفعة الجاية", "Next rent payment")}</p><div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-2xl font-bold">{formatEGP(monthlyPrice, locale)}</p><p className="mt-1 text-xs text-[var(--warning)]">{pick(locale, "مستحقة ١ أكتوبر ٢٠٢٦", "Due 1 October 2026")}</p></div><Link href="/my-maskan/payments" className="button-primary">{pick(locale, "التفاصيل", "View")}</Link></div></div><div className="bg-white p-5"><p className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><ShieldCheck className="size-4" />{pick(locale, "وديعة التأمين", "Security deposit")}</p><div className="mt-3 flex items-end justify-between gap-4"><div><p className="text-2xl font-bold">{formatEGP(deposit, locale)}</p><p className="mt-1 flex items-center gap-1 text-xs text-[var(--brand)]"><CheckCircle2 className="size-3.5" />{pick(locale, "محفوظة بشكل منفصل", "Held separately")}</p></div><span className="text-xs font-bold text-[var(--muted)]">{pick(locale, "مش إيراد إيجار", "Not rent revenue")}</span></div></div></div>
        </section>

        <section id="cameras" className="scroll-mt-24 border-y border-[var(--line)] py-6">
          <div className="mb-5 flex items-start justify-between gap-4"><div><p className="eyebrow">{pick(locale, "ضمن إقامتك الحالية", "Inside your current stay")}</p><h2 className="mt-1 flex items-center gap-2 text-xl font-bold"><Cctv className="size-5 text-[var(--brand)]" />{pick(locale, "كاميرات المساحات المشتركة", "Shared-area cameras")}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "المدخل والمعيشة المشتركة فقط حسب صلاحيتك. لا توجد كاميرات في الغرف أو الحمامات.", "Entrance and shared living areas only, based on your access. Bedrooms and bathrooms never have cameras.")}</p></div><span className="shrink-0 rounded-md bg-[#e5ebe7] px-3 py-2 text-xs font-bold text-[#315d4a]">{residentCameras.length} {pick(locale, "متاحة", "available")}</span></div>
          <CameraWall cameras={residentCameras} locale={locale} />
        </section>

        <section><div className="mb-4"><p className="eyebrow">{pick(locale, "خدمات المقيم", "Resident services")}</p><h2 className="mt-1 text-xl font-bold">{pick(locale, "محتاج إيه؟", "What do you need?")}</h2></div><div className="grid gap-3 sm:grid-cols-2">{actions.map(({ href, label, note, icon: Icon }) => <Link href={href} key={href} className="surface card-hover flex items-center gap-4 p-4"><span className="grid size-10 shrink-0 place-items-center rounded-md bg-[#eef3ef] text-[var(--brand)]"><Icon className="size-5" /></span><span className="min-w-0 flex-1"><strong className="block text-sm">{label}</strong><span className="mt-1 block text-xs text-[var(--muted)]">{note}</span></span><ArrowRight className="rtl-flip size-4 text-[var(--muted)]" /></Link>)}</div></section>
      </div>

      <aside className="grid content-start gap-5">
        <section className="surface p-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-[var(--brand)]"><Sparkles className="size-4" />{pick(locale, "مواعيد الوحدة", "Residence schedule")}</p><div className="mt-5 grid gap-4"><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#f2f4f1]"><CalendarCheck className="size-4" /></span><div><p className="text-sm font-bold">{pick(locale, "التنظيف الأسبوعي", "Weekly cleaning")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "الأحد · من ١٠ لـ١٢ ظهرًا", "Sunday · 10:00 AM–12:00 PM")}</p></div></div><div className="flex gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-[#f2f4f1]"><House className="size-4" /></span><div><p className="text-sm font-bold">{pick(locale, "معاينة الوحدة", "Residence inspection")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "١٢ أكتوبر · المناطق المشتركة فقط", "12 October · Common areas only")}</p></div></div></div></section>
        <section className="surface p-5"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold">{pick(locale, "طلب مفتوح", "Open request")}</p><span className="rounded bg-[#fff0d9] px-2 py-1 text-xs font-bold text-[var(--warning)]">{pick(locale, "تم التعيين", "Assigned")}</span></div><p className="mt-4 font-bold">{pick(locale, "تسريب في حوض المطبخ", "Kitchen sink leak")}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "الفني جاي النهارده من ٤ لـ٦ مساءً.", "A technician is scheduled today between 4:00 and 6:00 PM.")}</p><div className="mt-4 flex items-center gap-2 text-xs font-bold text-[var(--brand)]"><Clock3 className="size-4" />{pick(locale, "آخر تحديث من ٣٦ دقيقة", "Updated 36 minutes ago")}</div><Link href="/my-maskan/maintenance" className="button-secondary mt-5 w-full">{pick(locale, "تابع الطلب", "Track request")}</Link></section>
        <section className="rounded-lg bg-[#e8c2b3] p-5"><p className="text-xs font-bold uppercase tracking-[0.06em] text-[#6e3827]">{session.isUnitRepresentative ? pick(locale, "صلاحيتك كممثل وحدة", "Your unit representative access") : pick(locale, "ممثل الوحدة", "Unit representative")}</p><p className="mt-3 font-bold">{session.isUnitRepresentative ? (ar ? session.fullNameAr : session.fullName) : pick(locale, "أحمد سمير", "Ahmed Samir")}</p><p className="mt-2 text-sm leading-6 text-[#6e3827]">{pick(locale, "تنسيق التنظيف ومشاكل المناطق المشتركة فقط. الفلوس والعقود والخلافات مسؤولية مسكن.", "Cleaning coordination and common-area issues only. Money, contracts, and disputes stay with Maskan.")}</p></section>
      </aside>
    </div>
  );
}
