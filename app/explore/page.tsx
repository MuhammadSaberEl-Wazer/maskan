import type { Metadata } from "next";
import { ExploreCatalog } from "@/components/explore-catalog";
import { properties } from "@/lib/data";
import { getLocale } from "@/lib/demo-session";
import { pick } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "الوحدات والمساحات المتاحة",
};

export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>;
}) {
  const { area } = await searchParams;
  const locale = await getLocale();

  return (
    <main className="shell py-8 md:py-12">
      <div className="mb-8 max-w-2xl">
        <p className="eyebrow">{pick(locale, "وحدات مسكن في مصر", "Maskan residences across Egypt")}</p>
        <h1 className="mt-2 text-3xl font-bold md:text-4xl">{pick(locale, "اختار المساحة المناسبة ليك", "Choose the space that fits you")}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">
          {pick(locale, "اختار بسرعة، اعرف السعر والوديعة من البداية، وكل خطوة في سكنك تبقى موثّقة.", "Choose quickly, see rent and deposit upfront, and keep every step of your stay documented.")}
        </p>
        <p className="mt-4 border-s-2 border-[var(--brand)] ps-4 text-sm leading-6 text-[var(--foreground)]">{pick(locale, "المتاح حاليًا: غرفة خاصة، غرفة مشتركة، أو سرير داخل وحدة سكنية مُدارة. تأجير الوحدة بالكامل غير متاح في النموذج الحالي.", "Currently available: a private room, shared room, or bed inside a managed residence. Full-unit rental is not part of the current model.")}</p>
      </div>
      <ExploreCatalog properties={properties} initialArea={area} locale={locale} />
    </main>
  );
}
