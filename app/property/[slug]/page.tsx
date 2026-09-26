import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BedDouble, Check, Clock3, DoorOpen, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { durationOptions, properties } from "@/lib/data";
import { getLocale } from "@/lib/demo-session";
import { formatEGP } from "@/lib/format";
import { amenityLabel, areaLabel, genderLabel, neighborhoodLabel, pick, propertyName, roomKindLabel, structureLabel, tierLabel } from "@/lib/i18n";
import { PropertyGallery } from "@/components/property-gallery";

export function generateStaticParams() {
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const property = properties.find((item) => item.slug === slug);
  return { title: property ? propertyName(property.slug, property.name, locale) : pick(locale, "وحدة سكنية", "Residence") };
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const property = properties.find((item) => item.slug === slug);
  if (!property) notFound();
  const ar = locale === "ar";
  const firstAvailable = property.spaces.find((space) => space.availableBeds > 0);
  const localizedName = propertyName(property.slug, property.name, locale);

  return (
    <main className="pb-28 lg:pb-16">
      <PropertyGallery photos={property.gallery} name={localizedName} locale={locale} />

      <div className="shell grid gap-10 py-8 lg:grid-cols-[1fr_360px] lg:gap-14 lg:py-12">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold"><span className="rounded bg-[var(--accent)] px-2.5 py-1 text-[var(--brand-dark)]">{tierLabel(property.type, locale)}</span><span className="rounded bg-[#e9ecea] px-2.5 py-1">{genderLabel(property.gender, locale)} {ar ? "فقط" : "only"}</span><span className="text-[var(--muted)]" dir="ltr">{property.code}</span></div>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">{localizedName}</h1>
          <p className="mt-3 flex items-center gap-2 text-[var(--muted)]"><MapPin className="size-4" />{neighborhoodLabel(property.neighborhood, locale)}، {areaLabel(property.area, locale)}</p>
          <p className="mt-7 max-w-3xl text-lg leading-8">{ar ? "وحدة مفروشة وجاهزة للسكن، متجهزة علشان توفر راحة وخصوصية وخدمات يومية واضحة، مع فريق مسكن مسؤول عن التشغيل والدعم." : property.description}</p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
            {[
              [BedDouble, ar ? `${property.totalBeds} سرير` : `${property.totalBeds} beds`, pick(locale, "مخزون مُدار", "Managed inventory")],
              [Users, `${genderLabel(property.gender, locale)} ${ar ? "فقط" : "only"}`, pick(locale, "سياسة السكن المشترك", "Shared-residence policy")],
              [Clock3, ar ? "قريب من الخدمات" : property.commute, pick(locale, "وقت وصول تقريبي", "Typical drive")],
              [ShieldCheck, pick(locale, "عقد مسكن", "Maskan contract"), pick(locale, "شروط واضحة للمقيم", "Clear resident terms")],
            ].map(([Icon, value, label]) => { const ItemIcon = Icon as typeof BedDouble; return <div key={String(value)} className="bg-white p-4"><ItemIcon className="size-5 text-[var(--brand)]" /><p className="mt-3 text-sm font-bold">{String(value)}</p><p className="mt-1 text-xs text-[var(--muted)]">{String(label)}</p></div>; })}
          </div>

          <section className="mt-12"><p className="eyebrow">{pick(locale, "الخدمات الموجودة", "What is included")}</p><h2 className="mt-2 text-2xl font-bold">{pick(locale, "كل اللي تحتاجه لسكن مريح ومُدار", "Everything needed for a managed stay")}</h2><div className="mt-6 grid gap-3 sm:grid-cols-2">{property.amenities.map((amenity) => <div key={amenity} className="flex items-center gap-3 border-b border-[var(--line)] py-3 text-sm font-semibold"><Check className="size-4 text-[var(--brand)]" />{amenityLabel(amenity, locale)}</div>)}</div></section>

          <section className="mt-12" id="spaces"><p className="eyebrow">{pick(locale, "المتاح حاليًا", "Live inventory")}</p><h2 className="mt-2 text-2xl font-bold">{pick(locale, "اختار مساحتك بالضبط", "Choose your exact space")}</h2><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "الأوضة الخاصة بتتحسب كوحدة حجز واحدة، والأوضة المشتركة بتوضح عدد الأسرة المتاحة.", "A private room is one bookable inventory slot. Shared rooms show the available bed count.")}</p>
            <div className="mt-6 grid gap-3">{property.spaces.map((space) => { const available = space.availableBeds > 0; return <article key={space.id} className="surface grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center"><div><div className="flex flex-wrap items-center gap-2"><DoorOpen className="size-5 text-[var(--brand)]" /><h3 className="font-bold">{ar ? space.roomCode.replace("Room", "أوضة") : space.roomCode} · {roomKindLabel(space.kind, locale)}</h3><span className={`rounded px-2 py-1 text-xs font-bold ${available ? "bg-[#e6efdc] text-[var(--brand-dark)]" : "bg-[#f3e5e2] text-[var(--danger)]"}`}>{available ? (ar ? `${space.availableBeds} متاح` : `${space.availableBeds} available`) : pick(locale, "مكتملة حاليًا", "Currently full")}</span></div><p className="mt-2 text-sm text-[var(--muted)]">{structureLabel(space.structure, locale)} · {space.capacity} {ar ? "مقيم" : space.capacity === 1 ? "resident" : "residents"} · {space.ensuite ? pick(locale, "حمام خاص", "Private bathroom") : pick(locale, "حمام مشترك", "Shared bathroom")}</p></div><div className="flex items-center justify-between gap-5 sm:justify-end"><p className="text-end"><strong className="block text-lg">{formatEGP(space.monthlyPrice, locale)}</strong><span className="text-xs text-[var(--muted)]">{pick(locale, "يبدأ من / شهر", "from / month")}</span></p>{available ? <Link href={`/book/${space.id}`} className="button-primary">{pick(locale, "اختار", "Select")}</Link> : <button type="button" className="button-secondary" disabled>{pick(locale, "مكتمل", "Full")}</button>}</div></article>; })}</div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-24"><div className="surface p-6"><p className="text-sm font-bold text-[var(--muted)]">{pick(locale, "الأسعار الشهرية تبدأ من", "Monthly pricing from")}</p><p className="mt-1 text-3xl font-bold">{formatEGP(property.price, locale)}</p><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "الفرش والواي فاي والصيانة والدعم والتنظيف حسب المستوى. قد تطبق سياسة الاستخدام العادل للمرافق.", "Furnishing, Wi-Fi, maintenance, support, and tier-based cleaning included. Utility fair-use may apply.")}</p><div className="my-5 border-t border-[var(--line)]" /><div className="grid gap-3 text-sm">{durationOptions.map((option) => <div key={option.months} className="flex justify-between gap-4"><span>{ar ? option.months === 1 ? "شهر" : option.months === 12 ? "سنة" : `${option.months} شهور` : option.label}</span><span className="font-bold">{option.discount ? (ar ? `توفير تجريبي ${option.discount * 100}%` : `${option.discount * 100}% demo saving`) : pick(locale, "السعر الأساسي", "Standard rate")}</span></div>)}</div><p className="mt-5 rounded-md bg-[#f3f5f2] p-3 text-xs leading-5 text-[var(--muted)]">{pick(locale, "الوديعة بتظهر منفصلة وقت الحجز ومش بتتحسب إيراد إيجار. كل الأسعار تجريبية.", "A security deposit is shown separately during booking and is not rental revenue. Demo rates are illustrative.")}</p>{firstAvailable ? <Link href={`/book/${firstAvailable.id}`} className="button-primary mt-5 w-full">{pick(locale, "ابدأ حجز ديمو", "Start a demo booking")}</Link> : <button type="button" className="button-secondary mt-5 w-full">{pick(locale, "ادخل قائمة الانتظار", "Join waitlist")}</button>}</div><div className="mt-4 flex items-start gap-3 px-2 text-sm leading-6 text-[var(--muted)]"><Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />{pick(locale, "الوحدة بتديرها وتدعمها مسكن، مش مالك فردي أو مكتب إعلانات.", "Operated and supported by Maskan, not an individual landlord or listing agent.")}</div></aside>
      </div>

      {firstAvailable && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white p-3 shadow-[0_-8px_30px_rgba(20,40,30,.08)] lg:hidden"><div className="shell flex items-center justify-between gap-4 !w-full"><p><strong className="block">{pick(locale, "يبدأ من", "From")} {formatEGP(property.price, locale)}</strong><span className="text-xs text-[var(--muted)]">{pick(locale, "شهريًا · سعر تجريبي", "per month · demo rate")}</span></p><Link href={`/book/${firstAvailable.id}`} className="button-primary">{pick(locale, "اختار مساحة", "Select a space")}</Link></div></div>}
    </main>
  );
}
