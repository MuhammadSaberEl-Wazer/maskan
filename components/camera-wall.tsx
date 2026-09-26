"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { Cctv, Maximize2, Radio, ShieldAlert, X } from "lucide-react";
import type { DemoCamera } from "@/lib/cameras";
import type { Locale } from "@/lib/demo-accounts";
import { areaLabel, pick, propertyName } from "@/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CameraWall({ cameras, locale, defaultToFirstProperty = false }: { cameras: DemoCamera[]; locale: Locale; defaultToFirstProperty?: boolean }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<DemoCamera | null>(null);
  const [propertyFilter, setPropertyFilter] = useState(defaultToFirstProperty ? cameras[0]?.propertySlug ?? "all" : "all");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () => setClock(new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date()));
    update();
    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, [locale]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selected && !dialog.open) dialog.showModal();
    if (!selected && dialog.open) dialog.close();
  }, [selected]);

  const properties = useMemo(() => Array.from(new Map(cameras.map((camera) => [camera.propertySlug, camera])).values()), [cameras]);
  const visible = propertyFilter === "all" ? cameras : cameras.filter((camera) => camera.propertySlug === propertyFilter);

  return (
    <>
      {properties.length > 1 && (
        <div className="mb-5 flex flex-col justify-between gap-3 border-y border-[var(--line)] py-4 sm:flex-row sm:items-center">
          <p className="text-sm text-[var(--muted)]"><strong className="text-[var(--foreground)]">{visible.length}</strong> {pick(locale, "كاميرا متاحة في نطاقك", "cameras available in your scope")}</p>
          <Select value={propertyFilter} onValueChange={setPropertyFilter}>
            <SelectTrigger className="sm:w-72"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">{pick(locale, "كل الوحدات المسموح بها", "All permitted residences")}</SelectItem>{properties.map((camera) => <SelectItem key={camera.propertySlug} value={camera.propertySlug}>{propertyName(camera.propertySlug, camera.propertyName, locale)} · {areaLabel(camera.area, locale)}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((camera) => {
          const online = camera.status === "online";
          return (
            <article key={camera.id} className="surface overflow-hidden">
              <button type="button" onClick={() => setSelected(camera)} className="group relative block aspect-video w-full overflow-hidden bg-[#202220] text-start" aria-label={pick(locale, `افتح ${camera.labelAr}`, `Open ${camera.labelEn}`)}>
                <Image src={camera.image} alt="" fill className={`object-cover transition-transform duration-300 group-hover:scale-[1.02] ${online ? "opacity-80" : "grayscale opacity-35"}`} sizes="(max-width: 768px) 100vw, 33vw" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.3),transparent_35%,rgba(0,0,0,.62))]" />
                <div className="absolute start-3 top-3 flex items-center gap-2 rounded bg-black/65 px-2 py-1 text-[0.68rem] font-bold text-white backdrop-blur-sm">{online ? <><span className="size-1.5 rounded-full bg-[#ef5b50] shadow-[0_0_0_3px_rgba(239,91,80,.18)]" />{pick(locale, "مباشر · ديمو", "LIVE · DEMO")}</> : <><ShieldAlert className="size-3" />{pick(locale, "صيانة", "Maintenance")}</>}</div>
                <span className="absolute end-3 top-3 grid size-9 place-items-center rounded bg-black/55 text-white opacity-80 transition-opacity group-hover:opacity-100"><Maximize2 className="size-4" /></span>
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3 text-white"><div><p className="font-bold">{locale === "ar" ? camera.labelAr : camera.labelEn}</p><p className="mt-1 text-xs text-white/65" dir="ltr">{camera.id}</p></div><span className="text-xs font-semibold tabular-nums" dir="ltr">{online ? clock : "--:--:--"}</span></div>
              </button>
              <div className="flex items-center justify-between gap-3 p-3 text-xs"><span className="font-bold">{propertyName(camera.propertySlug, camera.propertyName, locale)}</span><span className="text-[var(--muted)]">{areaLabel(camera.area, locale)}</span></div>
            </article>
          );
        })}
      </div>

      <dialog ref={dialogRef} onClose={() => setSelected(null)} onCancel={() => setSelected(null)} className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-[#171817] p-0 text-white backdrop:bg-black/85 open:flex open:flex-col" aria-label={pick(locale, "عرض الكاميرا", "Camera viewer")}>
        {selected && <><header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-6"><div className="min-w-0"><p className="truncate font-bold">{locale === "ar" ? selected.labelAr : selected.labelEn}</p><p className="mt-0.5 truncate text-xs text-white/55">{propertyName(selected.propertySlug, selected.propertyName, locale)} · <span dir="ltr">{selected.id}</span></p></div><div className="flex items-center gap-3"><span className="hidden items-center gap-2 text-xs font-bold text-white/75 sm:flex"><Radio className="size-4 text-[#ef5b50]" />{pick(locale, "بث كاميرا تجريبي", "Demo camera feed")}</span><button type="button" onClick={() => setSelected(null)} className="grid size-10 place-items-center rounded hover:bg-white/10" aria-label={pick(locale, "إغلاق", "Close")}><X className="size-6" /></button></div></header><div className="relative min-h-0 flex-1 bg-black"><Image src={selected.image} alt="" fill priority className={`object-contain ${selected.status === "online" ? "opacity-90" : "grayscale opacity-35"}`} sizes="100vw" /><div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_49%,rgba(255,255,255,.025)_50%)] bg-[length:100%_4px]" /><div className="absolute start-4 top-4 flex items-center gap-2 rounded bg-black/65 px-3 py-2 text-xs font-bold backdrop-blur-sm"><span className="size-2 rounded-full bg-[#ef5b50]" />{pick(locale, "مباشر · محاكاة POC", "LIVE · POC SIMULATION")}</div><span className="absolute bottom-4 end-4 rounded bg-black/65 px-3 py-2 text-sm font-bold tabular-nums backdrop-blur-sm" dir="ltr">{clock}</span></div></>}
      </dialog>
    </>
  );
}
