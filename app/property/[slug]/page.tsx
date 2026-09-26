import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, Check, Clock3, DoorOpen, House, MapPin, ShieldCheck, Sparkles, Users } from "lucide-react";
import { durationOptions, properties } from "@/lib/data";
import { getLocale } from "@/lib/demo-session";
import { formatEGP } from "@/lib/format";
import { amenityLabel, areaLabel, genderLabel, neighborhoodLabel, pick, propertyName, rentalModelLabel, roomKindLabel, structureLabel, tierLabel } from "@/lib/i18n";
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
  const isFamily = property.rentalModel === "Family apartment";
  const firstAvailable = property.spaces.find((space) => space.availableBeds > 0);
  const localizedName = propertyName(property.slug, property.name, locale);

  return (
    <main className="pb-28 lg:pb-16">
      <PropertyGallery photos={property.gallery} name={localizedName} locale={locale} />

      <div className="shell grid gap-10 py-8 lg:grid-cols-[1fr_360px] lg:gap-14 lg:py-12">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="rounded bg-[var(--accent)] px-2.5 py-1 text-[var(--brand-dark)]">{tierLabel(property.type, locale)}</span>
            <span className={`rounded px-2.5 py-1 ${isFamily ? "bg-[#f0d8cf] text-[#76351f]" : "bg-[#e9ecea]"}`}>{rentalModelLabel(property.rentalModel, locale)}</span>
            {!isFamily && <span className="rounded bg-[#e9ecea] px-2.5 py-1">{genderLabel(property.gender, locale)} {ar ? "فقط" : "only"}</span>}
            <span className="text-[var(--muted)]" dir="ltr">{property.code}</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold md:text-5xl">{localizedName}</h1>
          <p className="mt-3 flex items-center gap-2 text-[var(--muted)]"><MapPin className="size-4" />{neighborhoodLabel(property.neighborhood, locale)}، {areaLabel(property.area, locale)}</p>
          <p className="mt-7 max-w-3xl text-lg leading-8">{isFamily ? pick(locale, "شقة كاملة مفروشة وجاهزة لأسرة واحدة، بإيجار شهري واضح للوحدة بالكامل وعقد موثّق مع مسكن، مع تشغيل وصيانة ودعم أثناء الإقامة.", property.description) : pick(locale, "سكن مشترك مفروش وجاهز، متجهز علشان يوفر راحة وخصوصية وخدمات يومية واضحة، مع فريق مسكن مسؤول عن التشغيل والدعم.", property.description)}</p>

          <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--line)] sm:grid-cols-4">
            {isFamily ? (
              <>
                <Summary icon={BedDouble} value={`${property.bedrooms} ${pick(locale, "غرف نوم", "bedrooms")}`} label={pick(locale, "شقة كاملة", "Entire apartment")} />
                <Summary icon={Bath} value={`${property.bathrooms} ${pick(locale, "حمام", "bathrooms")}`} label={pick(locale, "مرافق خاصة بالأسرة", "Private family facilities")} />
                <Summary icon={House} value={pick(locale, "أسرة واحدة", "One family")} label={pick(locale, "عقد واحد للوحدة", "One whole-unit contract")} />
                <Summary icon={ShieldCheck} value={pick(locale, "عقد مسكن", "Maskan contract")} label={pick(locale, "شروط واضحة وموثّقة", "Clear documented terms")} />
              </>
            ) : (
              <>
                <Summary icon={BedDouble} value={`${property.totalBeds} ${pick(locale, "سرير", "beds")}`} label={pick(locale, "مخزون مُدار", "Managed inventory")} />
                <Summary icon={Users} value={`${genderLabel(property.gender, locale)} ${pick(locale, "فقط", "only")}`} label={pick(locale, "سياسة السكن المشترك", "Shared-residence policy")} />
                <Summary icon={Clock3} value={pick(locale, "قريب من الخدمات", property.commute)} label={pick(locale, "وقت وصول تقريبي", "Typical drive")} />
                <Summary icon={ShieldCheck} value={pick(locale, "عقد مسكن", "Maskan contract")} label={pick(locale, "شروط واضحة للمقيم", "Clear resident terms")} />
              </>
            )}
          </div>

          <section className="mt-12">
            <p className="eyebrow">{pick(locale, "الخدمات الموجودة", "What is included")}</p>
            <h2 className="mt-2 text-2xl font-bold">{pick(locale, "كل اللي تحتاجه لسكن مريح ومُدار", "Everything needed for a managed stay")}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">{property.amenities.map((amenity) => <div key={amenity} className="flex items-center gap-3 border-b border-[var(--line)] py-3 text-sm font-semibold"><Check className="size-4 text-[var(--brand)]" />{amenityLabel(amenity, locale)}</div>)}</div>
          </section>

          <section className="mt-12" id="spaces">
            <p className="eyebrow">{pick(locale, "المتاح حاليًا", "Live inventory")}</p>
            <h2 className="mt-2 text-2xl font-bold">{isFamily ? pick(locale, "الوحدة الكاملة المتاحة", "Available full apartment") : pick(locale, "اختر مساحتك بالضبط", "Choose your exact space")}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{isFamily ? pick(locale, "السعر المعروض للشقة بالكامل شهريًا. لا تتم مشاركة الوحدة مع مقيمين غير الأسرة.", "The displayed monthly price covers the whole apartment. The unit is not shared with unrelated residents.") : pick(locale, "الأوضة الخاصة بتتحسب كوحدة حجز واحدة، والأوضة المشتركة بتوضح عدد الأسرة المتاحة.", "A private room is one bookable inventory slot. Shared rooms show the available bed count.")}</p>
            <div className="mt-6 grid gap-3">
              {property.spaces.map((space) => {
                const available = space.availableBeds > 0;
                const title = isFamily ? pick(locale, `شقة كاملة · ${property.bedrooms} غرف نوم`, `Full apartment · ${property.bedrooms} bedrooms`) : `${ar ? space.roomCode.replace("Room", "أوضة") : space.roomCode} · ${roomKindLabel(space.kind, locale)}`;
                const details = isFamily ? pick(locale, `${property.bedrooms} غرف نوم · ${property.bathrooms} حمام · حتى ${space.capacity} أفراد`, `${property.bedrooms} bedrooms · ${property.bathrooms} bathrooms · up to ${space.capacity} residents`) : `${structureLabel(space.structure, locale)} · ${space.capacity} ${pick(locale, "مقيم", space.capacity === 1 ? "resident" : "residents")} · ${space.ensuite ? pick(locale, "حمام خاص", "Private bathroom") : pick(locale, "حمام مشترك", "Shared bathroom")}`;
                return (
                  <article key={space.id} className="surface grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div><div className="flex flex-wrap items-center gap-2"><DoorOpen className="size-5 text-[var(--brand)]" /><h3 className="font-bold">{title}</h3><span className={`rounded px-2 py-1 text-xs font-bold ${available ? "bg-[#e6efdc] text-[var(--brand-dark)]" : "bg-[#f3e5e2] text-[var(--danger)]"}`}>{available ? (isFamily ? pick(locale, "متاحة للحجز", "Available to book") : pick(locale, `${space.availableBeds} متاح`, `${space.availableBeds} available`)) : pick(locale, "مكتملة حاليًا", "Currently full")}</span></div><p className="mt-2 text-sm text-[var(--muted)]">{details}</p></div>
                    <div className="flex items-center justify-between gap-5 sm:justify-end"><p className="text-end"><strong className="block text-lg">{formatEGP(space.monthlyPrice, locale)}</strong><span className="text-xs text-[var(--muted)]">{isFamily ? pick(locale, "للشقة بالكامل / شهر", "whole apartment / month") : pick(locale, "يبدأ من / شهر", "from / month")}</span></p>{available ? <Link href={`/book/${space.id}`} className="button-primary">{isFamily ? pick(locale, "احجز الوحدة", "Book unit") : pick(locale, "اختر", "Select")}</Link> : <button type="button" className="button-secondary" disabled>{pick(locale, "مكتمل", "Full")}</button>}</div>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-24">
          <div className="surface p-6">
            <p className="text-sm font-bold text-[var(--muted)]">{isFamily ? pick(locale, "إيجار الوحدة بالكامل شهريًا", "Whole-unit monthly rent") : pick(locale, "الأسعار الشهرية تبدأ من", "Monthly pricing from")}</p>
            <p className="mt-1 text-3xl font-bold">{formatEGP(property.price, locale)}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{isFamily ? pick(locale, "السعر للشقة كاملة بعقد أسرة واحد. الفرش والصيانة والدعم والخدمات الموضحة مشمولة حسب المستوى.", "The price covers the complete apartment under one family contract. Listed furnishing, maintenance, support, and services are tier-based.") : pick(locale, "الفرش والواي فاي والصيانة والدعم والتنظيف حسب المستوى. قد تطبق سياسة الاستخدام العادل للمرافق.", "Furnishing, Wi-Fi, maintenance, support, and tier-based cleaning included. Utility fair-use may apply.")}</p>
            <div className="my-5 border-t border-[var(--line)]" />
            <div className="grid gap-3 text-sm">{durationOptions.map((option) => <div key={option.months} className="flex justify-between gap-4"><span>{ar ? option.months === 1 ? "شهر" : option.months === 12 ? "سنة" : `${option.months} شهور` : option.label}</span><span className="font-bold">{option.discount ? pick(locale, `توفير تجريبي ${option.discount * 100}%`, `${option.discount * 100}% demo saving`) : pick(locale, "السعر الأساسي", "Standard rate")}</span></div>)}</div>
            <p className="mt-5 rounded-md bg-[#f3f5f2] p-3 text-xs leading-5 text-[var(--muted)]">{pick(locale, "الوديعة بتظهر منفصلة وقت الحجز ومش بتتحسب إيراد إيجار. كل الأسعار تجريبية.", "A security deposit is shown separately during booking and is not rental revenue. Demo rates are illustrative.")}</p>
            {firstAvailable ? <Link href={`/book/${firstAvailable.id}`} className="button-primary mt-5 w-full">{isFamily ? pick(locale, "ابدأ حجز الوحدة", "Start unit booking") : pick(locale, "ابدأ حجز ديمو", "Start a demo booking")}</Link> : <button type="button" className="button-secondary mt-5 w-full">{pick(locale, "ادخل قائمة الانتظار", "Join waitlist")}</button>}
          </div>
          <div className="mt-4 flex items-start gap-3 px-2 text-sm leading-6 text-[var(--muted)]"><Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--brand)]" />{pick(locale, "الوحدة بتديرها وتدعمها مسكن، مش مالك فردي أو مكتب إعلانات.", "Operated and supported by Maskan, not an individual landlord or listing agent.")}</div>
        </aside>
      </div>

      {firstAvailable && <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-white p-3 shadow-[0_-8px_30px_rgba(20,40,30,.08)] lg:hidden"><div className="shell flex items-center justify-between gap-4 !w-full"><p><strong className="block">{isFamily ? pick(locale, "الوحدة بالكامل", "Whole unit") : pick(locale, "يبدأ من", "From")} {formatEGP(property.price, locale)}</strong><span className="text-xs text-[var(--muted)]">{pick(locale, "شهريًا · سعر تجريبي", "per month · demo rate")}</span></p><Link href={`/book/${firstAvailable.id}`} className="button-primary">{isFamily ? pick(locale, "احجز الوحدة", "Book unit") : pick(locale, "اختر مساحة", "Select a space")}</Link></div></div>}
    </main>
  );
}

function Summary({ icon: Icon, value, label }: { icon: typeof BedDouble; value: string; label: string }) {
  return <div className="bg-white p-4"><Icon className="size-5 text-[var(--brand)]" /><p className="mt-3 text-sm font-bold">{value}</p><p className="mt-1 text-xs text-[var(--muted)]">{label}</p></div>;
}
