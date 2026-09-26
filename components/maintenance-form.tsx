"use client";

import { useState } from "react";
import { CheckCircle2, Paperclip, Send } from "lucide-react";
import type { Locale } from "@/lib/demo-accounts";
import { pick } from "@/lib/i18n";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MaintenanceForm({ locale }: { locale: Locale }) {
  const [reference, setReference] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(false);
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/demo/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.fromEntries(data.entries())),
    });
    const result = (await response.json()) as { reference?: string };
    if (!response.ok || !result.reference) {
      setError(true);
      setPending(false);
      return;
    }
    setReference(result.reference);
    setPending(false);
  }

  if (reference) {
    return <div className="surface p-7 text-center"><CheckCircle2 className="mx-auto size-10 text-[var(--brand)]" /><h2 className="mt-4 text-xl font-bold">{pick(locale, "تم إرسال الطلب", "Request submitted")}</h2><p className="mt-2 text-sm text-[var(--muted)]" dir="ltr">{reference} · {pick(locale, "الحالة: تم الاستلام", "Status: Submitted")}</p><p className="mt-3 text-sm leading-6 text-[var(--muted)]">{pick(locale, "الطلب محفوظ في دورة الديمو وهيظهر لموظف التشغيل عند الدخول بحسابه.", "The request is saved in the demo cycle and appears to operations staff after sign-in.")}</p><button type="button" onClick={() => setReference("")} className="button-secondary mt-5">{pick(locale, "طلب جديد", "Submit another request")}</button></div>;
  }

  return (
    <form className="surface p-5 sm:p-7" onSubmit={submit}>
      <h2 className="text-xl font-bold">{pick(locale, "بلّغ عن مشكلة صيانة", "Report a maintenance issue")}</h2>
      <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "كل طلب بيمر بمراحل: تم الاستلام، تم التعيين، جاري التنفيذ، وتم الحل.", "Requests move through Submitted, Assigned, In progress, and Resolved.")}</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label><span className="mb-2 block text-sm font-bold">{pick(locale, "نوع المشكلة", "Category")}</span><Select name="category" required><SelectTrigger><SelectValue placeholder={pick(locale, "اختر النوع", "Select category")} /></SelectTrigger><SelectContent><SelectItem value="plumbing">{pick(locale, "سباكة", "Plumbing")}</SelectItem><SelectItem value="electricity">{pick(locale, "كهرباء", "Electricity")}</SelectItem><SelectItem value="furniture">{pick(locale, "أثاث", "Furniture")}</SelectItem><SelectItem value="appliance">{pick(locale, "جهاز منزلي", "Appliance")}</SelectItem><SelectItem value="internet">{pick(locale, "إنترنت", "Internet")}</SelectItem><SelectItem value="cleaning">{pick(locale, "نظافة", "Cleaning")}</SelectItem><SelectItem value="other">{pick(locale, "أخرى", "Other")}</SelectItem></SelectContent></Select></label>
        <label><span className="mb-2 block text-sm font-bold">{pick(locale, "الأولوية", "Priority")}</span><Select name="priority" defaultValue="normal"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">{pick(locale, "عادية", "Low")}</SelectItem><SelectItem value="normal">{pick(locale, "مهمة", "Normal")}</SelectItem><SelectItem value="urgent">{pick(locale, "عاجلة", "Urgent")}</SelectItem></SelectContent></Select></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">{pick(locale, "عنوان المشكلة", "Issue title")}</span><Input name="title" required placeholder={pick(locale, "مثال: تسريب في حوض المطبخ", "Example: Kitchen sink leak")} /></label>
        <label className="sm:col-span-2"><span className="mb-2 block text-sm font-bold">{pick(locale, "التفاصيل", "Details")}</span><Textarea name="description" required placeholder={pick(locale, "قول لنا المشكلة فين وبدأت إمتى", "Tell us where the issue is and when it started")} /></label>
      </div>
      {error && <p className="mt-4 text-sm font-bold text-[var(--danger)]">{pick(locale, "مقدرناش نحفظ الطلب. حاول تاني.", "The request could not be saved. Try again.")}</p>}
      <div className="mt-5 flex flex-col justify-between gap-4 border-t border-[var(--line)] pt-5 sm:flex-row sm:items-center"><button type="button" className="button-secondary"><Paperclip className="size-4" />{pick(locale, "أضف صورة خاصة", "Add private evidence")}</button><button className="button-primary" disabled={pending}><Send className="size-4" />{pending ? pick(locale, "جاري الإرسال...", "Submitting...") : pick(locale, "إرسال الطلب", "Submit request")}</button></div>
      <p className="mt-4 text-xs leading-5 text-[var(--muted)]">{pick(locale, "الصور تعتبر بيانات خاصة في تطبيق Supabase النهائي. نسخة الديمو الحالية لا ترفع ملفات.", "Evidence is private data in the intended Supabase implementation. This demo does not upload files.")}</p>
    </form>
  );
}
