"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, RotateCcw, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Locale } from "@/lib/demo-accounts";
import { pick } from "@/lib/i18n";

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export function PropertyGallery({ photos, name, locale }: { photos: string[]; name: string; locale: Locale }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const ar = locale === "ar";

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (activeIndex !== null && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog.open) dialog.close();
  }, [activeIndex]);

  const openPhoto = (index: number) => {
    setZoom(MIN_ZOOM);
    setActiveIndex(index);
  };

  const close = () => {
    setZoom(MIN_ZOOM);
    setActiveIndex(null);
  };

  const showPrevious = () => {
    setZoom(MIN_ZOOM);
    setActiveIndex((current) => current === null ? 0 : (current - 1 + photos.length) % photos.length);
  };

  const showNext = () => {
    setZoom(MIN_ZOOM);
    setActiveIndex((current) => current === null ? 0 : (current + 1) % photos.length);
  };

  return (
    <>
      <section className="shell relative grid gap-2 pt-3 md:grid-cols-[1.7fr_1fr] md:grid-rows-2" aria-label={pick(locale, "صور الوحدة", "Residence photos")}>
        <button type="button" onClick={() => openPhoto(0)} className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-[#d9ddd9] text-start md:row-span-2 md:aspect-auto md:min-h-[540px]" aria-label={pick(locale, "افتح الصورة الرئيسية", "Open main photo")}>
          <Image src={photos[0]} alt={ar ? `المساحة الرئيسية في ${name}` : `${name} main living space`} fill priority className="object-cover transition-transform duration-300 group-hover:scale-[1.015]" sizes="(max-width: 768px) 100vw, 68vw" />
        </button>
        {photos.slice(1, 3).map((photo, index) => (
          <button type="button" key={photo} onClick={() => openPhoto(index + 1)} className="group relative hidden overflow-hidden rounded-lg bg-[#d9ddd9] text-start md:block" aria-label={pick(locale, `افتح الصورة ${index + 2}`, `Open photo ${index + 2}`)}>
            <Image src={photo} alt={ar ? `صورة داخلية ${index + 2}` : `${name} interior ${index + 2}`} fill className="object-cover transition-transform duration-300 group-hover:scale-[1.025]" sizes="32vw" />
          </button>
        ))}
        <button type="button" onClick={() => openPhoto(0)} className="button-light absolute bottom-4 end-4 min-h-10 bg-white/95 px-3 text-xs shadow-lg backdrop-blur-sm" aria-label={pick(locale, "اعرض كل صور الوحدة", "View all residence photos")}>
          <Images className="size-4" />{pick(locale, `كل الصور (${photos.length})`, `All photos (${photos.length})`)}
        </button>
      </section>

      <dialog
        ref={dialogRef}
        onClose={close}
        onCancel={() => setActiveIndex(null)}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") showPrevious();
          if (event.key === "ArrowRight") showNext();
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-screen max-w-none bg-[#171817] p-0 text-white backdrop:bg-black/85 open:flex open:flex-col"
        aria-label={pick(locale, "عارض صور الوحدة", "Residence photo viewer")}
      >
        {activeIndex !== null && (
          <>
            <header className="relative z-20 flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-3 sm:px-5">
              <p className="min-w-20 text-sm font-bold">{activeIndex + 1} / {photos.length}</p>
              <div className="flex items-center gap-1 rounded-md bg-white/8 p-1">
                <button type="button" onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - ZOOM_STEP))} disabled={zoom === MIN_ZOOM} className="grid size-10 place-items-center rounded hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35" title={pick(locale, "تصغير", "Zoom out")} aria-label={pick(locale, "تصغير الصورة", "Zoom out")}><ZoomOut className="size-5" /></button>
                <span className="w-12 text-center text-xs font-bold">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + ZOOM_STEP))} disabled={zoom === MAX_ZOOM} className="grid size-10 place-items-center rounded hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35" title={pick(locale, "تكبير", "Zoom in")} aria-label={pick(locale, "تكبير الصورة", "Zoom in")}><ZoomIn className="size-5" /></button>
                <button type="button" onClick={() => setZoom(MIN_ZOOM)} className="grid size-10 place-items-center rounded hover:bg-white/10" title={pick(locale, "الحجم الأصلي", "Reset zoom")} aria-label={pick(locale, "إرجاع الحجم الأصلي", "Reset zoom")}><RotateCcw className="size-4" /></button>
              </div>
              <button type="button" onClick={close} className="grid size-10 place-items-center rounded hover:bg-white/10" title={pick(locale, "إغلاق", "Close")} aria-label={pick(locale, "إغلاق معرض الصور", "Close photo viewer")}><X className="size-6" /></button>
            </header>

            <div className="relative min-h-0 flex-1 overflow-auto">
              <button type="button" onClick={showPrevious} className="fixed start-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 backdrop-blur-sm hover:bg-black/80 sm:start-5" title={pick(locale, "الصورة السابقة", "Previous photo")} aria-label={pick(locale, "الصورة السابقة", "Previous photo")}><ChevronLeft className="rtl-flip size-6" /></button>
              <div className="grid min-h-full min-w-full place-items-center p-4 sm:p-16">
                <button type="button" onClick={() => setZoom((current) => current === MAX_ZOOM ? MIN_ZOOM : Math.min(MAX_ZOOM, current + ZOOM_STEP))} className="relative cursor-zoom-in" style={{ width: `${zoom * 100}%`, height: `${zoom * 70}vh` }} aria-label={pick(locale, "كبّر الصورة", "Enlarge photo")}>
                  <Image key={photos[activeIndex]} src={photos[activeIndex]} alt={ar ? `صورة ${activeIndex + 1} من ${name}` : `${name} photo ${activeIndex + 1}`} fill className="object-contain" sizes="100vw" priority />
                </button>
              </div>
              <button type="button" onClick={showNext} className="fixed end-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/55 backdrop-blur-sm hover:bg-black/80 sm:end-5" title={pick(locale, "الصورة التالية", "Next photo")} aria-label={pick(locale, "الصورة التالية", "Next photo")}><ChevronRight className="rtl-flip size-6" /></button>
            </div>

            <footer className="z-20 flex h-20 shrink-0 items-center justify-center gap-2 overflow-x-auto border-t border-white/10 bg-[#171817] px-4">
              {photos.map((photo, index) => <button type="button" key={photo} onClick={() => openPhoto(index)} className={`relative h-14 w-20 shrink-0 overflow-hidden rounded border-2 ${index === activeIndex ? "border-white" : "border-transparent opacity-55 hover:opacity-100"}`} aria-label={pick(locale, `اعرض الصورة ${index + 1}`, `Show photo ${index + 1}`)}><Image src={photo} alt="" fill className="object-cover" sizes="80px" /></button>)}
            </footer>
          </>
        )}
      </dialog>
    </>
  );
}
