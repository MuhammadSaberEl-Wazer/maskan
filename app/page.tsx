import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Headphones, MapPin, Search, ShieldCheck, Sparkles, Wrench } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { areas, properties } from "@/lib/data";
import { getLocale } from "@/lib/demo-session";
import { areaLabel, pick } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default async function Home() {
  const locale = await getLocale();
  const ar = locale === "ar";
  const featuredProperties = [properties[0], properties[8], properties[11]];
  const benefits = [
    { icon: Sparkles, title: pick(locale, "سرعة", "Speed"), body: pick(locale, "تدور وتختار وتحجز وتستلم مكانك بخطوات قليلة وواضحة.", "Search, choose, book, and move in through a few clear steps.") },
    { icon: Headphones, title: pick(locale, "ثقة", "Trust"), body: pick(locale, "السعر والوديعة والخدمات واضحين، وفريق مسكن مسؤول عن كل خطوة.", "Pricing, deposits, and services are clear, with one Maskan team accountable throughout.") },
    { icon: ShieldCheck, title: pick(locale, "أمان", "Safety"), body: pick(locale, "الهوية والعقد والدفعات وطلبات الصيانة موثّقة ومحفوظة.", "Identity, contracts, payments, and maintenance requests are documented and protected.") },
    { icon: Wrench, title: pick(locale, "إدارة مستمرة", "Managed throughout"), body: pick(locale, "تشغيل وصيانة ودعم من جهة واحدة طول مدة إقامتك.", "Operations, maintenance, and support from one team throughout your stay.") },
  ];
  const tiers = [
    { name: pick(locale, "اقتصادي", "Essential"), note: pick(locale, "سكن مشترك عملي وسعره مناسب", "Smart, practical shared living"), color: "bg-[#dce9a8]" },
    { name: pick(locale, "كومفورت", "Comfort"), note: pick(locale, "خصوصية أكتر وخدمات متكاملة", "More privacy and a complete service package"), color: "bg-[#b9d7cf]" },
    { name: pick(locale, "بلس", "Plus"), note: pick(locale, "أوض خاصة وتجهيز وخدمة أعلى", "Private-first residences and premium standards"), color: "bg-[#e8c2b3]" },
  ];

  return (
    <main>
      <section className="relative min-h-[650px] overflow-hidden bg-[#252725] text-white md:min-h-[720px]">
        <Image src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90" alt={ar ? "ريسبشن مفروش في وحدة من مسكن" : "Bright furnished Maskan residence"} fill priority className="object-cover object-center" sizes="100vw" />
        <div className={`absolute inset-0 ${ar ? "bg-[linear-gradient(270deg,rgba(24,24,23,.86)_0%,rgba(24,24,23,.44)_55%,rgba(24,24,23,.08)_100%)]" : "bg-[linear-gradient(90deg,rgba(24,24,23,.84)_0%,rgba(24,24,23,.44)_55%,rgba(24,24,23,.08)_100%)]"}`} />
        <div className="shell relative flex min-h-[650px] flex-col justify-end pb-8 pt-20 md:min-h-[720px] md:pb-12">
          <div className="max-w-2xl pb-9 md:pb-14">
            <p className="mb-4 text-sm font-bold text-[#dce9a8]">{pick(locale, "سرعة · ثقة · أمان", "Speed · Trust · Safety")}</p>
            <h1 className="arabic-display max-w-2xl text-4xl font-bold leading-[1.2] sm:text-5xl md:text-[3.4rem]">{pick(locale, "سكنك جاهز من أول البحث لحد الاستلام.", "Find your place. Move in with confidence.")}</h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/85 md:text-lg">{pick(locale, "اختار الوحدة والمساحة المناسبة، اعرف السعر كامل قبل الحجز، وخلي عقدك ودفعاتك وطلباتك موثّقة في مكان واحد.", "Choose the right residence and space, see the full price before booking, and keep contracts, payments, and requests documented in one place.")}</p>
          </div>

          <form action="/explore" className="grid gap-px overflow-hidden rounded-lg bg-white/25 shadow-2xl md:grid-cols-[1.15fr_1fr_1fr_auto]">
            <label className="bg-white p-3 text-[var(--foreground)]"><span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><MapPin className="size-3.5" />{pick(locale, "المنطقة", "Area")}</span><Select name="area" defaultValue="All areas"><SelectTrigger className="mt-1 h-8 border-0 p-0 shadow-none focus:ring-0"><SelectValue /></SelectTrigger><SelectContent>{areas.map((area) => <SelectItem key={area} value={area}>{areaLabel(area, locale)}</SelectItem>)}</SelectContent></Select></label>
            <label className="bg-white p-3 text-[var(--foreground)]"><span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "هتسكن إمتى؟", "Move-in")}</span><Input name="moveIn" type="date" className="mt-1 h-8 border-0 p-0 shadow-none focus:ring-0" /></label>
            <label className="bg-white p-3 text-[var(--foreground)]"><span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "مدة السكن", "Stay")}</span><Select name="duration" defaultValue="1"><SelectTrigger className="mt-1 h-8 border-0 p-0 shadow-none focus:ring-0"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="1">{pick(locale, "شهر", "1 month")}</SelectItem><SelectItem value="3">{pick(locale, "٣ شهور", "3 months")}</SelectItem><SelectItem value="6">{pick(locale, "٦ شهور", "6 months")}</SelectItem><SelectItem value="12">{pick(locale, "سنة", "12 months")}</SelectItem></SelectContent></Select></label>
            <button className="flex min-h-16 items-center justify-center gap-2 bg-[var(--accent)] px-7 font-bold text-[var(--brand-dark)] transition-colors hover:bg-[#e6f1b9]"><Search className="size-5" />{pick(locale, "دوّر على سكن", "Search residences")}</button>
          </form>
        </div>
      </section>

      <section className="shell py-16 md:py-24">
        <div className="mb-8 flex items-end justify-between gap-5"><div><p className="eyebrow">{pick(locale, "متاح دلوقتي", "Available now")}</p><h2 className="section-title mt-2">{pick(locale, "وحدات جاهزة للسكن", "Residences ready to move into")}</h2></div><Link href="/explore" className="button-secondary hidden shrink-0 sm:inline-flex">{pick(locale, "شوف كل الوحدات", "View all residences")}<ArrowRight className="rtl-flip size-4" /></Link></div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredProperties.map((property, index) => <PropertyCard key={property.id} property={property} locale={locale} priority={index < 2} />)}</div>
        <Link href="/explore" className="button-secondary mt-6 w-full sm:hidden">{pick(locale, "شوف كل الوحدات", "View all residences")}<ArrowRight className="rtl-flip size-4" /></Link>
      </section>

      <section className="border-y border-[var(--line)] bg-white py-16 md:py-20"><div className="shell"><div className="max-w-2xl"><p className="eyebrow">{pick(locale, "وعد مسكن", "The Maskan promise")}</p><h2 className="section-title mt-2">{pick(locale, "سرعة في الوصول. ثقة في التعامل. أمان في السكن.", "Faster access. Trusted service. Safer stays.")}</h2></div><div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">{benefits.map(({ icon: Icon, title, body }) => <article key={title} className="border-t-2 border-[var(--foreground)] pt-5"><Icon className="size-6 text-[var(--brand)]" strokeWidth={1.8} /><h3 className="mt-5 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p></article>)}</div></div></section>

      <section className="shell py-16 md:py-24"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end"><div><p className="eyebrow">{pick(locale, "اختيار يناسب ميزانيتك", "A standard for every budget")}</p><h2 className="section-title mt-2">{pick(locale, "اختار مستوى مسكن المناسب ليك", "Choose the Maskan experience that fits")}</h2><p className="mt-4 max-w-lg leading-7 text-[var(--muted)]">{pick(locale, "كل وحدة لها مستوى واحد واضح، علشان الفرش والخدمات وتجربة السكان تبقى متناسقة.", "Every residence follows one coherent tier, keeping furnishing, services, and resident experience consistent.")}</p></div><div className="grid gap-3 sm:grid-cols-3">{tiers.map((tier) => <div key={tier.name} className={`${tier.color} min-h-44 rounded-lg p-5`}><CheckCircle2 className="size-5 text-[var(--brand-dark)]" /><h3 className="mt-10 text-xl font-bold">{tier.name}</h3><p className="mt-2 text-sm leading-6 text-[var(--brand-dark)]/75">{tier.note}</p></div>)}</div></div></section>

      <footer className="bg-[var(--brand-dark)] py-10 text-white"><div className="shell flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="font-black tracking-[0.1em]">MASKAN · مسكن</p><p className="mt-2 max-w-md text-sm leading-6 text-white/65">{pick(locale, "سكن مُدار في مصر مبني على السرعة والثقة والأمان.", "Managed residences across Egypt, built around speed, trust, and safety.")}</p></div><div className="flex flex-col gap-2 text-xs text-white/55"><Link href="/app-info" className="font-bold text-white/80">{pick(locale, "معلومات النسخة التجريبية", "Demo app information")}</Link><p>{pick(locale, "كل بيانات المحفظة والأرقام المالية تجريبية.", "POC portfolio and financial figures are illustrative.")}</p></div></div></footer>
    </main>
  );
}
