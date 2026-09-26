"use client";

import { useMemo, useState } from "react";
import { ListFilter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { PropertyCard } from "@/components/property-card";
import { areas, type ProductTier, type Property, type UnitGender } from "@/lib/data";
import { formatEGP } from "@/lib/format";
import type { Locale } from "@/lib/demo-accounts";
import { areaLabel, pick, tierLabel } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RoomFilter = "Any room" | "Private room" | "Shared room";

type Filters = {
  area: string;
  gender: "Any" | UnitGender;
  tier: "Any" | ProductTier;
  room: RoomFilter;
  minPrice: number;
  maxPrice: number;
  availableOnly: boolean;
};

const defaultFilters: Filters = {
  area: "All areas",
  gender: "Any",
  tier: "Any",
  room: "Any room",
  minPrice: 2500,
  maxPrice: 11000,
  availableOnly: true,
};

function FilterFields({
  filters,
  setFilters,
  locale,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  locale: Locale;
}) {
  const ar = locale === "ar";
  return (
    <div className="grid gap-5">
      <label>
        <span className="mb-2 block text-sm font-bold">{pick(locale, "المنطقة", "Area")}</span>
        <Select
          value={filters.area}
          onValueChange={(value) => setFilters((current) => ({ ...current, area: value }))}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>{areas.map((area) => <SelectItem key={area} value={area}>{areaLabel(area, locale)}</SelectItem>)}</SelectContent>
        </Select>
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">{pick(locale, "الوحدة مخصصة لـ", "Residents")}</legend>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-[#edf0ed] p-1">
          {(["Any", "Men", "Women"] as const).map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => setFilters((current) => ({ ...current, gender: option }))}
              className={`min-h-9 rounded px-2 text-xs font-bold ${
                filters.gender === option ? "bg-white shadow-sm" : "text-[var(--muted)]"
              }`}
            >
              {option === "Any" ? pick(locale, "الكل", "Any") : option === "Men" ? pick(locale, "رجال", "Men") : pick(locale, "سيدات", "Women")}
            </button>
          ))}
        </div>
      </fieldset>

      <label>
        <span className="mb-2 block text-sm font-bold">{pick(locale, "مستوى مسكن", "Maskan tier")}</span>
        <Select
          value={filters.tier}
          onValueChange={(value) =>
            setFilters((current) => ({
              ...current,
              tier: value as Filters["tier"],
            }))
          }
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Any">{pick(locale, "كل المستويات", "Any")}</SelectItem><SelectItem value="Essential">{tierLabel("Essential", locale)}</SelectItem><SelectItem value="Comfort">{tierLabel("Comfort", locale)}</SelectItem><SelectItem value="Plus">{tierLabel("Plus", locale)}</SelectItem></SelectContent>
        </Select>
      </label>

      <label>
        <span className="mb-2 block text-sm font-bold">{pick(locale, "نوع المساحة", "Space type")}</span>
        <Select
          value={filters.room}
          onValueChange={(value) =>
            setFilters((current) => ({
              ...current,
              room: value as RoomFilter,
            }))
          }
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Any room">{pick(locale, "أي نوع", "Any room")}</SelectItem><SelectItem value="Private room">{pick(locale, "أوضة خاصة", "Private room")}</SelectItem><SelectItem value="Shared room">{pick(locale, "أوضة مشتركة", "Shared room")}</SelectItem></SelectContent>
        </Select>
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-bold">{pick(locale, "الإيجار الشهري", "Monthly rent")}</legend>
        <div className="grid grid-cols-2 gap-2">
          <label><span className="mb-1.5 block text-xs text-[var(--muted)]">{pick(locale, "أقل سعر", "Minimum")}</span><Input type="number" min="0" max={filters.maxPrice} step="250" value={filters.minPrice} onChange={(event) => setFilters((current) => ({ ...current, minPrice: Math.min(Number(event.target.value), current.maxPrice) }))} aria-label={pick(locale, "أقل إيجار شهري", "Minimum monthly rent")} /></label>
          <label><span className="mb-1.5 block text-xs text-[var(--muted)]">{pick(locale, "أقصى سعر", "Maximum")}</span><Input type="number" min={filters.minPrice} step="250" value={filters.maxPrice} onChange={(event) => setFilters((current) => ({ ...current, maxPrice: Math.max(Number(event.target.value), current.minPrice) }))} aria-label={pick(locale, "أقصى إيجار شهري", "Maximum monthly rent")} /></label>
        </div>
        <p className="mt-2 text-xs text-[var(--muted)]">{formatEGP(filters.minPrice, locale)} – {formatEGP(filters.maxPrice, locale)}</p>
      </fieldset>

      <label className="flex cursor-pointer items-center justify-between gap-4 border-t border-[var(--line)] pt-4">
        <span className="text-sm font-bold">{pick(locale, "المتاح دلوقتي بس", "Available now")}</span>
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(event) =>
            setFilters((current) => ({ ...current, availableOnly: event.target.checked }))
          }
          className="size-5 accent-[var(--brand)]"
        />
      </label>
    </div>
  );
}

export function ExploreCatalog({
  properties,
  initialArea,
  locale,
}: {
  properties: Property[];
  initialArea?: string;
  locale: Locale;
}) {
  const [filters, setFilters] = useState<Filters>(() => ({
    ...defaultFilters,
    area: areas.includes(initialArea as (typeof areas)[number]) ? initialArea! : "All areas",
  }));
  const [sort, setSort] = useState("recommended");

  const results = useMemo(() => {
    const filtered = properties.filter((property) => {
      const roomMatches =
        filters.room === "Any room" ||
        property.spaces.some(
          (space) => space.kind === filters.room && (!filters.availableOnly || space.availableBeds > 0),
        );

      return (
        (filters.area === "All areas" || property.area === filters.area) &&
        (filters.gender === "Any" || property.gender === filters.gender) &&
        (filters.tier === "Any" || property.type === filters.tier) &&
        property.price >= filters.minPrice &&
        property.price <= filters.maxPrice &&
        (!filters.availableOnly || property.available > 0) &&
        roomMatches
      );
    });

    return filtered.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;
      if (sort === "availability") return b.available - a.available;
      return Number(b.type === "Comfort") - Number(a.type === "Comfort");
    });
  }, [filters, properties, sort]);

  const reset = () => setFilters(defaultFilters);

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="surface sticky top-20 hidden h-fit p-5 lg:block">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-bold">
            <SlidersHorizontal className="size-4" aria-hidden="true" /> {pick(locale, "الفلاتر", "Filters")}
          </h2>
          <button type="button" onClick={reset} className="text-xs font-bold text-[var(--brand)]">
            {pick(locale, "مسح", "Reset")}
          </button>
        </div>
        <FilterFields filters={filters} setFilters={setFilters} locale={locale} />
      </aside>

      <div>
        <details className="surface mb-4 lg:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-bold">
            <span className="flex items-center gap-2">
              <ListFilter className="size-4" aria-hidden="true" /> {pick(locale, "فلتر الوحدات", "Filter residences")}
            </span>
            <span className="text-xs text-[var(--muted)]">{results.length} {pick(locale, "نتيجة", "results")}</span>
          </summary>
          <div className="border-t border-[var(--line)] p-4">
            <FilterFields filters={filters} setFilters={setFilters} locale={locale} />
            <button type="button" onClick={reset} className="button-secondary mt-5 w-full">
              <RotateCcw className="size-4" aria-hidden="true" /> {pick(locale, "امسح الفلاتر", "Reset filters")}
            </button>
          </div>
        </details>

        <div className="mb-5 flex items-center justify-between gap-4">
          <p className="text-sm text-[var(--muted)]">
            <strong className="text-[var(--foreground)]">{results.length}</strong> {pick(locale, "وحدة مُدارة", "managed residences")}
          </p>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden text-[var(--muted)] sm:inline">{pick(locale, "ترتيب", "Sort")}</span>
            <Select
              value={sort}
              onValueChange={setSort}
            >
              <SelectTrigger className="h-10 w-48"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="recommended">{pick(locale, "الأنسب", "Recommended")}</SelectItem><SelectItem value="price-low">{pick(locale, "السعر: الأقل الأول", "Price: low to high")}</SelectItem><SelectItem value="price-high">{pick(locale, "السعر: الأعلى الأول", "Price: high to low")}</SelectItem><SelectItem value="availability">{pick(locale, "الأكثر إتاحة", "Most availability")}</SelectItem></SelectContent>
            </Select>
          </label>
        </div>

        {results.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {results.map((property, index) => (
              <PropertyCard key={property.id} property={property} locale={locale} priority={index < 3} />
            ))}
          </div>
        ) : (
          <div className="surface grid min-h-72 place-items-center p-8 text-center">
            <div>
              <h2 className="text-xl font-bold">{pick(locale, "مفيش وحدات مطابقة للفلاتر دي", "No residences match those filters")}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{pick(locale, "جرّب منطقة أو نوع أو سعر أوسع.", "Try a wider area, room type, or price range.")}</p>
              <button type="button" onClick={reset} className="button-primary mt-5">
                {pick(locale, "امسح الفلاتر", "Reset filters")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
