"use client";

import { useState } from "react";
import { Building2, CalendarDays, MapPin, RotateCcw, Search } from "lucide-react";
import { areas, type RentalModel } from "@/lib/data";
import type { Locale } from "@/lib/demo-accounts";
import { areaLabel, pick, rentalModelLabel } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RentalChoice = "Any model" | RentalModel;

export function HomeSearchForm({ locale }: { locale: Locale }) {
  const [area, setArea] = useState("All areas");
  const [rentalModel, setRentalModel] = useState<RentalChoice>("Any model");
  const [moveIn, setMoveIn] = useState("");
  const [duration, setDuration] = useState("any");
  const hasFilters = area !== "All areas" || rentalModel !== "Any model" || Boolean(moveIn) || duration !== "any";
  const dir = locale === "ar" ? "rtl" : "ltr";

  function clearFilters() {
    setArea("All areas");
    setRentalModel("Any model");
    setMoveIn("");
    setDuration("any");
  }

  return (
    <form action="/explore" className="grid gap-px overflow-hidden rounded-lg bg-white/30 text-start shadow-2xl md:grid-cols-2 xl:grid-cols-[1.05fr_1.05fr_1fr_1fr_auto]">
      <label className="bg-white p-3 text-[var(--foreground)]">
        <span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><Building2 className="size-3.5" />{pick(locale, "نوع السكن", "Rental model")}</span>
        <Select name="rentalModel" value={rentalModel} onValueChange={(value) => setRentalModel(value as RentalChoice)} dir={dir}>
          <SelectTrigger className="mt-1 h-10 border-0 bg-[#f3f5f3] px-3 shadow-none focus:ring-2"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Any model">{pick(locale, "كل أنواع السكن", "All rental models")}</SelectItem><SelectItem value="Shared housing">{rentalModelLabel("Shared housing", locale)}</SelectItem><SelectItem value="Family apartment">{rentalModelLabel("Family apartment", locale)}</SelectItem></SelectContent>
        </Select>
      </label>

      <label className="bg-white p-3 text-[var(--foreground)]">
        <span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><MapPin className="size-3.5" />{pick(locale, "المنطقة", "Area")}</span>
        <Select name="area" value={area} onValueChange={setArea} dir={dir}>
          <SelectTrigger className="mt-1 h-10 border-0 bg-[#f3f5f3] px-3 shadow-none focus:ring-2"><SelectValue /></SelectTrigger>
          <SelectContent>{areas.map((item) => <SelectItem key={item} value={item}>{areaLabel(item, locale)}</SelectItem>)}</SelectContent>
        </Select>
      </label>

      <label className="bg-white p-3 text-[var(--foreground)]">
        <span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "موعد الانتقال", "Move-in date")}</span>
        <Input name="moveIn" type="date" value={moveIn} onChange={(event) => setMoveIn(event.target.value)} onClick={(event) => event.currentTarget.showPicker?.()} className="mt-1 h-10 cursor-pointer border-0 bg-[#f3f5f3] px-3 shadow-none focus:ring-2" aria-label={pick(locale, "اختر موعد الانتقال", "Choose move-in date")} />
      </label>

      <label className="bg-white p-3 text-[var(--foreground)]">
        <span className="flex items-center gap-2 text-xs font-bold text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "مدة الإقامة", "Stay length")}</span>
        <Select name="duration" value={duration} onValueChange={setDuration} dir={dir}>
          <SelectTrigger className="mt-1 h-10 border-0 bg-[#f3f5f3] px-3 shadow-none focus:ring-2"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="any">{pick(locale, "أي مدة", "Any length")}</SelectItem><SelectItem value="1">{pick(locale, "شهر", "1 month")}</SelectItem><SelectItem value="3">{pick(locale, "3 شهور", "3 months")}</SelectItem><SelectItem value="6">{pick(locale, "6 شهور", "6 months")}</SelectItem><SelectItem value="12">{pick(locale, "سنة", "12 months")}</SelectItem></SelectContent>
        </Select>
      </label>

      <div className="grid grid-cols-[auto_1fr] bg-white md:col-span-2 xl:col-span-1 xl:grid-cols-[auto_auto]">
        <button type="button" onClick={clearFilters} disabled={!hasFilters} className="grid min-h-16 min-w-14 place-items-center border-e border-[var(--line)] text-[var(--muted)] hover:bg-[#f1f3f1] hover:text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-35" title={pick(locale, "مسح الاختيارات", "Clear selections")} aria-label={pick(locale, "مسح اختيارات البحث", "Clear search selections")}><RotateCcw className="size-4" /></button>
        <button className="flex min-h-16 items-center justify-center gap-2 bg-[var(--accent)] px-6 font-bold text-[var(--brand-dark)] transition-colors hover:bg-[#e6f1b9]"><Search className="size-5" />{pick(locale, "ابحث عن سكن", "Search residences")}</button>
      </div>
    </form>
  );
}
