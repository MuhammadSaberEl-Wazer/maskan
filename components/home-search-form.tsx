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
    <form action="/explore" className="grid gap-2 overflow-hidden rounded-lg border border-white/15 bg-[#202522]/90 p-2 text-start shadow-2xl backdrop-blur-md md:grid-cols-2 md:gap-px md:border-0 md:bg-white/30 md:p-0 xl:grid-cols-[1.05fr_1.05fr_1fr_1fr_auto]">
      <div className="rounded-md border border-white/10 bg-white/5 p-3 text-white md:rounded-none md:border-0 md:bg-white md:text-[var(--foreground)]">
        <span id="home-rental-model-label" className="flex items-center gap-2 text-xs font-bold text-white/65 md:text-[var(--muted)]"><Building2 className="size-3.5" />{pick(locale, "نوع السكن", "Rental model")}</span>
        <Select name="rentalModel" value={rentalModel} onValueChange={(value) => setRentalModel(value as RentalChoice)} dir={dir}>
          <SelectTrigger aria-labelledby="home-rental-model-label" className="mt-1 h-11 border-white/15 bg-[#303833] px-3 text-white shadow-none hover:border-white/30 focus:border-[var(--accent)] focus:ring-[rgba(220,233,168,.16)] md:h-10 md:border-0 md:bg-[#f3f5f3] md:text-[var(--foreground)] md:focus:ring-[rgba(40,89,67,.1)]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="Any model">{pick(locale, "كل أنواع السكن", "All rental models")}</SelectItem><SelectItem value="Shared housing">{rentalModelLabel("Shared housing", locale)}</SelectItem><SelectItem value="Family apartment">{rentalModelLabel("Family apartment", locale)}</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="rounded-md border border-white/10 bg-white/5 p-3 text-white md:rounded-none md:border-0 md:bg-white md:text-[var(--foreground)]">
        <span id="home-area-label" className="flex items-center gap-2 text-xs font-bold text-white/65 md:text-[var(--muted)]"><MapPin className="size-3.5" />{pick(locale, "المنطقة", "Area")}</span>
        <Select name="area" value={area} onValueChange={setArea} dir={dir}>
          <SelectTrigger aria-labelledby="home-area-label" className="mt-1 h-11 border-white/15 bg-[#303833] px-3 text-white shadow-none hover:border-white/30 focus:border-[var(--accent)] focus:ring-[rgba(220,233,168,.16)] md:h-10 md:border-0 md:bg-[#f3f5f3] md:text-[var(--foreground)] md:focus:ring-[rgba(40,89,67,.1)]"><SelectValue /></SelectTrigger>
          <SelectContent>{areas.map((item) => <SelectItem key={item} value={item}>{areaLabel(item, locale)}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <label className="rounded-md border border-white/10 bg-white/5 p-3 text-white md:rounded-none md:border-0 md:bg-white md:text-[var(--foreground)]">
        <span className="flex items-center gap-2 text-xs font-bold text-white/65 md:text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "موعد الانتقال", "Move-in date")}</span>
        <Input name="moveIn" type="date" value={moveIn} onChange={(event) => setMoveIn(event.target.value)} className="mt-1 h-11 cursor-pointer border-white/15 bg-[#303833] px-3 text-white shadow-none [color-scheme:dark] hover:border-white/30 focus:border-[var(--accent)] focus:ring-[rgba(220,233,168,.16)] md:h-10 md:border-0 md:bg-[#f3f5f3] md:text-[var(--foreground)] md:[color-scheme:light] md:focus:ring-[rgba(40,89,67,.1)]" aria-label={pick(locale, "اختر موعد الانتقال", "Choose move-in date")} />
      </label>

      <div className="rounded-md border border-white/10 bg-white/5 p-3 text-white md:rounded-none md:border-0 md:bg-white md:text-[var(--foreground)]">
        <span id="home-duration-label" className="flex items-center gap-2 text-xs font-bold text-white/65 md:text-[var(--muted)]"><CalendarDays className="size-3.5" />{pick(locale, "مدة الإقامة", "Stay length")}</span>
        <Select name="duration" value={duration} onValueChange={setDuration} dir={dir}>
          <SelectTrigger aria-labelledby="home-duration-label" className="mt-1 h-11 border-white/15 bg-[#303833] px-3 text-white shadow-none hover:border-white/30 focus:border-[var(--accent)] focus:ring-[rgba(220,233,168,.16)] md:h-10 md:border-0 md:bg-[#f3f5f3] md:text-[var(--foreground)] md:focus:ring-[rgba(40,89,67,.1)]"><SelectValue /></SelectTrigger>
          <SelectContent><SelectItem value="any">{pick(locale, "أي مدة", "Any length")}</SelectItem><SelectItem value="1">{pick(locale, "شهر", "1 month")}</SelectItem><SelectItem value="3">{pick(locale, "3 شهور", "3 months")}</SelectItem><SelectItem value="6">{pick(locale, "6 شهور", "6 months")}</SelectItem><SelectItem value="12">{pick(locale, "سنة", "12 months")}</SelectItem></SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-[auto_1fr] overflow-hidden rounded-md bg-transparent md:col-span-2 md:rounded-none md:bg-white xl:col-span-1 xl:grid-cols-[auto_auto]">
        <button type="button" onClick={clearFilters} disabled={!hasFilters} className="grid min-h-14 min-w-14 place-items-center border-e border-white/15 bg-white/10 text-white/70 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 md:min-h-16 md:border-[var(--line)] md:bg-white md:text-[var(--muted)] md:hover:bg-[#f1f3f1] md:hover:text-[var(--foreground)]" title={pick(locale, "مسح الاختيارات", "Clear selections")} aria-label={pick(locale, "مسح اختيارات البحث", "Clear search selections")}><RotateCcw className="size-4" /></button>
        <button className="flex min-h-16 items-center justify-center gap-2 bg-[var(--accent)] px-6 font-bold text-[var(--brand-dark)] transition-colors hover:bg-[#e6f1b9]"><Search className="size-5" />{pick(locale, "ابحث عن سكن", "Search residences")}</button>
      </div>
    </form>
  );
}
