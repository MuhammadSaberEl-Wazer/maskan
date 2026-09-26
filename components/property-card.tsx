import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Property } from "@/lib/data";
import { formatEGP } from "@/lib/format";
import type { Locale } from "@/lib/demo-accounts";
import { areaLabel, genderLabel, neighborhoodLabel, propertyName, rentalModelLabel, tierLabel } from "@/lib/i18n";

export function PropertyCard({ property, locale, priority = false }: { property: Property; locale: Locale; priority?: boolean }) {
  const isFull = property.available === 0;
  const isFamily = property.rentalModel === "Family apartment";
  const ar = locale === "ar";

  return (
    <Link href={`/property/${property.slug}`} className="surface card-hover group block overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d9ddd9]">
        <Image src={property.image} alt={`${property.name} furnished interior`} fill priority={priority} className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw" />
        <div className="absolute start-3 top-3 flex max-w-[calc(100%-1.5rem)] flex-wrap gap-2">
          <span className="rounded bg-white/95 px-2.5 py-1 text-xs font-bold text-[var(--foreground)] shadow-sm">{tierLabel(property.type, locale)}</span>
          <span className={`rounded px-2.5 py-1 text-xs font-bold shadow-sm backdrop-blur-sm ${isFamily ? "bg-[#c76445]/95 text-white" : "bg-[#65746d]/95 text-white"}`}>{rentalModelLabel(property.rentalModel, locale)}</span>
          {!isFamily && <span className="rounded bg-[#f4f1eb]/95 px-2.5 py-1 text-xs font-bold text-[var(--foreground)] shadow-sm">{genderLabel(property.gender, locale)}</span>}
        </div>
        <span className={`absolute bottom-3 end-3 rounded px-2.5 py-1 text-xs font-bold shadow-sm ${isFull ? "bg-[#f3e5e2] text-[var(--danger)]" : "bg-[var(--accent)] text-[var(--brand-dark)]"}`}>
          {isFull ? pickAvailability(ar, isFamily, 0) : pickAvailability(ar, isFamily, property.available)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--muted)]">{property.code}</p>
            <h3 className="mt-1 truncate text-lg font-bold">{propertyName(property.slug, property.name, locale)}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--muted)]"><MapPin aria-hidden="true" className="size-3.5" />{neighborhoodLabel(property.neighborhood, locale)}، {areaLabel(property.area, locale)}</p>
          </div>
          <ArrowUpRight aria-hidden="true" className="rtl-flip mt-1 size-5 shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <div className="mt-5 flex items-end justify-between gap-3 border-t border-[var(--line)] pt-4">
          <p>
            <span className="text-lg font-bold">{formatEGP(property.price, locale)}</span>
            <span className="block text-xs text-[var(--muted)]">{isFamily ? (ar ? "للشقة بالكامل / شهر" : "whole apartment / month") : (ar ? "يبدأ من / شهر للفرد" : "from / month per resident")}</span>
          </p>
          <span className="max-w-32 text-end text-xs font-semibold text-[var(--muted)]">{isFamily ? (ar ? `${property.bedrooms} غرف نوم` : `${property.bedrooms} bedrooms`) : (ar ? "قريب من الخدمات والمواصلات" : property.commute)}</span>
        </div>
      </div>
    </Link>
  );
}

function pickAvailability(ar: boolean, family: boolean, available: number) {
  if (!available) return ar ? "قائمة انتظار" : "Join waitlist";
  if (family) return ar ? "الوحدة متاحة" : "Unit available";
  return ar ? `${available} متاح` : `${available} available`;
}
