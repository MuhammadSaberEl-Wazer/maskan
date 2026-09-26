"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CreditCard, FileText, ShieldCheck } from "lucide-react";
import { durationOptions, getBookingQuote, type DurationMonths, type Property, type Space } from "@/lib/data";
import type { DemoSession } from "@/lib/demo-session";
import type { Locale } from "@/lib/demo-accounts";
import { formatEGP } from "@/lib/format";
import { pick, propertyName, roomKindLabel } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BookingFlow({ property, space, session, locale }: { property: Property; space: Space; session: DemoSession; locale: Locale }) {
  const ar = locale === "ar";
  const [step, setStep] = useState(0);
  const [duration, setDuration] = useState<DurationMonths>(3);
  const [moveIn, setMoveIn] = useState("2026-10-01");
  const [phone, setPhone] = useState("0100 123 4567");
  const [occupation, setOccupation] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);
  const [reference, setReference] = useState("");
  const quote = useMemo(() => getBookingQuote(space.monthlyPrice, duration), [duration, space.monthlyPrice]);
  const name = ar ? session.fullNameAr : session.fullName;
  const steps = ar ? ["الإقامة", "بياناتك", "المراجعة", "تم"] : ["Stay", "Your details", "Review", "Confirmed"];

  async function confirmBooking() {
    setPending(true);
    setError(false);
    const response = await fetch("/api/demo/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bedId: space.id, duration, moveIn }),
    });
    const result = (await response.json()) as { reference?: string };
    if (!response.ok || !result.reference) {
      setError(true);
      setPending(false);
      return;
    }
    setReference(result.reference);
    setStep(3);
    setPending(false);
  }

  if (step === 3) {
    return (
      <section className="surface mx-auto max-w-2xl overflow-hidden">
        <div className="bg-[var(--brand)] px-6 py-10 text-center text-white sm:px-10"><CheckCircle2 className="mx-auto size-12 text-[var(--accent)]" strokeWidth={1.6} /><p className="mt-5 text-sm font-bold uppercase tracking-[0.08em] text-white/70">{pick(locale, "تم تأكيد حجز الديمو", "Demo booking confirmed")}</p><h1 className="mt-2 text-3xl font-bold">{pick(locale, "المساحة اتحجزت باسمك", "Your space is reserved")}</h1><p className="mx-auto mt-3 max-w-lg leading-7 text-white/75">{pick(locale, "الحجز محفوظ داخل دورة الديمو وهيظهر دلوقتي في مسكني ولوحة التشغيل. مفيش فلوس اتخصمت.", "The booking is saved in the demo cycle and now appears in My Maskan and operations. No payment was charged.")}</p></div>
        <div className="p-6 sm:p-8"><dl className="grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-[var(--muted)]">{pick(locale, "رقم الحجز", "Reference")}</dt><dd className="mt-1 font-bold" dir="ltr">{reference}</dd></div><div><dt className="text-[var(--muted)]">{pick(locale, "تاريخ السكن", "Move-in")}</dt><dd className="mt-1 font-bold">{moveIn}</dd></div><div><dt className="text-[var(--muted)]">{pick(locale, "الوحدة", "Residence")}</dt><dd className="mt-1 font-bold">{propertyName(property.slug, property.name, locale)} · {ar ? space.roomCode.replace("Room", "أوضة") : space.roomCode}</dd></div><div><dt className="text-[var(--muted)]">{pick(locale, "الإيجار الشهري", "Monthly rent")}</dt><dd className="mt-1 font-bold">{formatEGP(quote.monthlyPrice, locale)}</dd></div></dl><div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/my-maskan" className="button-primary flex-1">{pick(locale, "افتح مسكني", "Open My Maskan")}<ArrowRight className="rtl-flip size-4" /></Link><Link href="/explore" className="button-secondary flex-1">{pick(locale, "شوف وحدات تانية", "Browse more residences")}</Link></div></div>
      </section>
    );
  }

  return (
    <div>
      <ol className="mb-8 grid grid-cols-4 gap-2" aria-label={pick(locale, "مراحل الحجز", "Booking progress")}>{steps.map((label, index) => <li key={label} className="min-w-0"><div className={`h-1 rounded ${index <= step ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`} /><p className={`mt-2 truncate text-xs font-bold ${index <= step ? "text-[var(--foreground)]" : "text-[var(--muted)]"}`}>{index + 1}. {label}</p></li>)}</ol>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section className="surface p-5 sm:p-7">
          {step === 0 && <div><p className="eyebrow">{pick(locale, "الخطوة الأولى", "Step 1")}</p><h1 className="mt-2 text-2xl font-bold">{pick(locale, "حدد مدة إقامتك", "Plan your stay")}</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "في خطوات قليلة هتثبت مكانك، والسعر والوديعة ظاهرين قدامك قبل التأكيد.", "Secure your space in a few steps, with rent and deposit visible before confirmation.")}</p><label className="mt-7 block"><span className="mb-2 block text-sm font-bold">{pick(locale, "تاريخ بداية السكن", "Move-in date")}</span><Input type="date" min="2026-09-27" value={moveIn} onChange={(event) => setMoveIn(event.target.value)} /></label><fieldset className="mt-7"><legend className="mb-3 text-sm font-bold">{pick(locale, "مدة الإقامة", "Length of stay")}</legend><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{durationOptions.map((option) => <button type="button" key={option.months} onClick={() => setDuration(option.months)} className={`min-h-20 rounded-md border p-3 text-start ${duration === option.months ? "border-[var(--brand)] bg-[#eef4f0]" : "border-[var(--line)] bg-white"}`}><span className="block text-sm font-bold">{ar ? option.months === 1 ? "شهر" : option.months === 12 ? "سنة" : `${option.months} شهور` : option.label}</span><span className="mt-1 block text-xs text-[var(--muted)]">{option.discount ? pick(locale, `توفير تجريبي ${option.discount * 100}%`, `${option.discount * 100}% demo saving`) : pick(locale, "السعر الأساسي", "Standard rate")}</span></button>)}</div></fieldset></div>}

          {step === 1 && <div><p className="eyebrow">{pick(locale, "الخطوة الثانية", "Step 2")}</p><h1 className="mt-2 text-2xl font-bold">{pick(locale, "بيانات المقيم", "Resident details")}</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "بياناتك موثقة على حسابك علشان استلام الوحدة والتعامل بعد السكن يبقوا أسهل وأأمن.", "Your details stay documented on your account, making move-in and support easier and safer.")}</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">{pick(locale, "الاسم بالكامل", "Full name")}</span><Input value={name} disabled /></label><label><span className="mb-2 block text-sm font-bold">{pick(locale, "رقم الموبايل", "Mobile number")}</span><Input value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="01xx xxx xxxx" /></label><label><span className="mb-2 block text-sm font-bold">{pick(locale, "البريد الإلكتروني", "Email")}</span><Input value={session.email} disabled dir="ltr" /></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">{pick(locale, "الدراسة أو الشغل", "Occupation")}</span><Select value={occupation} onValueChange={setOccupation}><SelectTrigger><SelectValue placeholder={pick(locale, "اختار", "Select one")} /></SelectTrigger><SelectContent><SelectItem value="student">{pick(locale, "طالب", "Student")}</SelectItem><SelectItem value="employee">{pick(locale, "موظف", "Employee")}</SelectItem><SelectItem value="self-employed">{pick(locale, "عمل حر", "Self-employed")}</SelectItem><SelectItem value="other">{pick(locale, "أخرى", "Other")}</SelectItem></SelectContent></Select></label></div></div>}

          {step === 2 && <div><p className="eyebrow">{pick(locale, "الخطوة الثالثة", "Step 3")}</p><h1 className="mt-2 text-2xl font-bold">{pick(locale, "راجع وأكد", "Review and confirm")}</h1><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "راجع الإيجار والوديعة كل واحد لوحده قبل تأكيد الحجز التجريبي.", "Review rent and deposit separately before confirming the demo booking.")}</p><div className="mt-7 grid gap-4 sm:grid-cols-2"><div className="rounded-md bg-[#f2f4f1] p-4"><FileText className="size-5 text-[var(--brand)]" /><p className="mt-3 text-xs text-[var(--muted)]">{pick(locale, "المقيم", "Resident")}</p><p className="font-bold">{name}</p><p className="mt-1 text-sm text-[var(--muted)]">{phone}</p></div><div className="rounded-md bg-[#f2f4f1] p-4"><ShieldCheck className="size-5 text-[var(--brand)]" /><p className="mt-3 text-xs text-[var(--muted)]">{pick(locale, "الإقامة", "Stay")}</p><p className="font-bold">{duration} {pick(locale, duration === 1 ? "شهر" : "شهور", duration === 1 ? "month" : "months")}</p><p className="mt-1 text-sm text-[var(--muted)]">{pick(locale, "من", "From")} {moveIn}</p></div></div><div className="mt-5 rounded-md border border-[var(--line)] p-4"><div className="flex items-start gap-3"><CreditCard className="mt-0.5 size-5 text-[var(--brand)]" /><div><p className="font-bold">{pick(locale, "دفع وهمي للـPOC", "Dummy payment for the POC")}</p><p className="mt-1 text-sm leading-6 text-[var(--muted)]">{pick(locale, "لا توجد بوابة دفع. التأكيد يحفظ حجز الديمو فقط.", "No gateway is connected. Confirmation only saves the demo booking.")}</p></div></div></div><label className="mt-5 flex cursor-pointer items-start gap-3 text-sm leading-6"><input type="checkbox" className="mt-1 size-4 accent-[var(--brand)]" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />{pick(locale, "فاهم إن الأسعار والوديعة وشروط العقد هنا تجريبية وتحتاج تأكيد في التشغيل الحقيقي.", "I understand that pricing, deposit, and contract terms are illustrative and require confirmation in real operations.")}</label>{error && <p className="mt-4 text-sm font-bold text-[var(--danger)]">{pick(locale, "حصلت مشكلة في حفظ الحجز. حاول تاني.", "The booking could not be saved. Try again.")}</p>}</div>}

          <div className="mt-8 flex items-center justify-between border-t border-[var(--line)] pt-5"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="button-secondary" disabled={step === 0}><ArrowLeft className="rtl-flip size-4" />{pick(locale, "رجوع", "Back")}</button><button type="button" onClick={() => step === 2 ? void confirmBooking() : setStep((current) => Math.min(2, current + 1))} className="button-primary" disabled={(step === 1 && (!phone || !occupation)) || (step === 2 && (!accepted || pending))}>{step === 2 ? pending ? pick(locale, "جاري الحفظ...", "Saving...") : pick(locale, "أكد حجز الديمو", "Confirm demo booking") : pick(locale, "كمّل", "Continue")}{step < 2 && <ArrowRight className="rtl-flip size-4" />}</button></div>
        </section>

        <aside className="surface h-fit overflow-hidden lg:sticky lg:top-24"><div className="border-b border-[var(--line)] bg-[#eef2ed] p-5"><p className="text-xs font-bold uppercase tracking-[0.08em] text-[var(--brand)]">{pick(locale, "مساحتك", "Your space")}</p><h2 className="mt-2 text-lg font-bold">{propertyName(property.slug, property.name, locale)}</h2><p className="mt-1 text-sm text-[var(--muted)]">{ar ? space.roomCode.replace("Room", "أوضة") : space.roomCode} · {roomKindLabel(space.kind, locale)} · {space.bedCode}</p></div><div className="p-5 text-sm"><dl className="grid gap-3"><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{pick(locale, "الإيجار الشهري", "Monthly rent")}</dt><dd className="font-bold">{formatEGP(quote.monthlyPrice, locale)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{pick(locale, "الوديعة", "Security deposit")}</dt><dd className="font-bold">{formatEGP(quote.depositAmount, locale)}</dd></div><div className="flex justify-between gap-4"><dt className="text-[var(--muted)]">{pick(locale, "مدة الإقامة", "Stay duration")}</dt><dd className="font-bold">{duration} {pick(locale, duration === 1 ? "شهر" : "شهور", duration === 1 ? "month" : "months")}</dd></div></dl><div className="my-4 border-t border-[var(--line)]" /><div className="flex items-end justify-between gap-4"><div><p className="text-[var(--muted)]">{pick(locale, "المطلوب للحجز", "Due to reserve")}</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "أول شهر + الوديعة", "First month + deposit")}</p></div><p className="text-xl font-bold">{formatEGP(quote.monthlyPrice + quote.depositAmount, locale)}</p></div><div className="mt-5 rounded-md bg-[#f5f1e9] p-3 text-xs leading-5 text-[var(--muted)]"><p className="flex gap-2"><Check className="mt-0.5 size-3.5 shrink-0 text-[var(--brand)]" />{pick(locale, "الوديعة التزام منفصل ومش إيراد إيجار.", "The deposit is tracked separately and is not rental revenue.")}</p></div></div></aside>
      </div>
    </div>
  );
}
