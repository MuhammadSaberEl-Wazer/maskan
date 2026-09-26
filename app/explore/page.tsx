import type { Metadata } from "next";
import { ExploreCatalog } from "@/components/explore-catalog";
import { properties } from "@/lib/data";
import { getLocale } from "@/lib/demo-session";
import { pick } from "@/lib/i18n";

export const metadata: Metadata = { title: "الوحدات والمساحات المتاحة" };

export default async function Explore({ searchParams }: { searchParams: Promise<{ area?: string; rentalModel?: string }> }) {
  const { area, rentalModel } = await searchParams;
  const locale = await getLocale();

  return (
    <main className="shell py-8 md:py-12">
      <div className="mb-8 max-w-3xl text-start">
        <p className="eyebrow">{pick(locale, "وحدات مسكن في مصر", "Maskan residences across Egypt")}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{pick(locale, "اختر السكن المناسب ليك", "Choose the home that fits you")}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{pick(locale, "اختار بسرعة، اعرف السعر والوديعة من البداية، وكل خطوة في سكنك تبقى موثّقة.", "Choose quickly, see rent and deposit upfront, and keep every step of your stay documented.")}</p>
        <p className="mt-4 border-s-2 border-[var(--brand)] ps-4 text-sm leading-6 text-[var(--foreground)]">{pick(locale, "المتاح حاليًا: غرف وأسرة داخل سكن مشترك مُدار، وشقق كاملة تُؤجر لأسرة واحدة. سعر شقة الأسرة هو سعر الوحدة بالكامل، وليس سعرًا للفرد.", "Currently available: rooms and beds in managed shared housing, plus complete apartments rented to one family. Family-apartment prices cover the whole unit, not one resident.")}</p>
        <p className="mt-2 text-xs text-[var(--muted)]">{pick(locale, "الداتا التجريبية مركزة حاليًا في القاهرة الكبرى، بينما يستهدف مسكن التوسع في مصر كلها.", "The demo portfolio currently focuses on Greater Cairo, while Maskan remains designed for nationwide expansion.")}</p>
      </div>
      <ExploreCatalog properties={properties} initialArea={area} initialRentalModel={rentalModel} locale={locale} />
    </main>
  );
}
