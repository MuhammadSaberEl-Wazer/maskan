import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Property } from "@/lib/data";
import { formatEGP } from "@/lib/format";
import type { Locale } from "@/lib/demo-accounts";
import { areaLabel, genderLabel, neighborhoodLabel, propertyName, tierLabel } from "@/lib/i18n";

export function PropertyCard({ property, locale, priority = false }: { property: Property; locale: Locale; priority?: boolean }) {
  const isFull = property.available === 0;
  const ar = locale === "ar";

  return (
    <Link
      href={`/property/${property.slug}`}
      className="surface card-hover group block overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#d9ddd9]">
        <Image
          src={property.image}
          alt={`${property.name} furnished common area`}
          fill
          priority={priority}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded bg-white/95 px-2.5 py-1 text-xs font-bold text-[var(--foreground)] shadow-sm">
            {tierLabel(property.type, locale)}
          </span>
          <span className="rounded bg-[#1d2521]/85 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {genderLabel(property.gender, locale)}
          </span>
        </div>
        <span
          className={`absolute bottom-3 right-3 rounded px-2.5 py-1 text-xs font-bold shadow-sm ${
            isFull ? "bg-[#f3e5e2] text-[var(--danger)]" : "bg-[var(--accent)] text-[var(--brand-dark)]"
          }`}
        >
          {isFull ? (ar ? "قائمة انتظار" : "Join waitlist") : ar ? `${property.available} متاح` : `${property.available} available`}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--muted)]">{property.code}</p>
            <h3 className="mt-1 truncate text-lg font-bold">{propertyName(property.slug, property.name, locale)}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--muted)]">
              <MapPin aria-hidden="true" className="size-3.5" />
              {neighborhoodLabel(property.neighborhood, locale)}، {areaLabel(property.area, locale)}
            </p>
          </div>
          <ArrowUpRight
            aria-hidden="true"
            className="mt-1 size-5 shrink-0 text-[var(--muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </div>
        <div className="mt-5 flex items-end justify-between border-t border-[var(--line)] pt-4">
          <p>
            <span className="text-lg font-bold">{formatEGP(property.price, locale)}</span>
            <span className="text-sm text-[var(--muted)]"> {ar ? "/ شهر" : "/ month"}</span>
          </p>
          <span className="text-xs font-semibold text-[var(--muted)]">{ar ? "قريب من الخدمات والمواصلات" : property.commute}</span>
        </div>
      </div>
    </Link>
  );
}
