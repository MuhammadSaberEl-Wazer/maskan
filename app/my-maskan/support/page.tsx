import Link from "next/link";
import { Headphones, LockKeyhole, Phone, Wrench } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { getDemoChats, getDemoSession, getLocale, type DemoChatMessage } from "@/lib/demo-session";
import { pick } from "@/lib/i18n";

export default async function SupportPage() {
  const [session, locale, chats] = await Promise.all([getDemoSession(), getLocale(), getDemoChats()]);
  if (!session) return null;

  const welcome: DemoChatMessage = {
    id: `support-welcome-${session.accountId}`,
    authorId: "maskan-support",
    authorName: pick(locale, "دعم مسكن", "Maskan Support"),
    authorType: "support",
    text: pick(locale, "أهلا بك. ابعت لنا تفاصيل سؤالك أو شكواك هنا. لو فيه عطل محتاج فني، افتح طلب صيانة علشان تاخد رقم متابعة وموعد زيارة.", "Welcome. Send us your question or complaint here. If an issue needs a technician, create a maintenance request for a tracking reference and visit window."),
    createdAt: "2026-09-26T08:00:00.000Z",
  };
  const messages = [welcome, ...(chats.support[session.accountId] ?? [])];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <section className="surface overflow-hidden">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5">
          <div><p className="eyebrow">{pick(locale, "محادثة مباشرة", "Direct conversation")}</p><h2 className="mt-1 text-xl font-bold">{pick(locale, "دعم المقيمين", "Resident support")}</h2></div>
          <span className="flex items-center gap-2 rounded-md bg-[#edf6f0] px-3 py-2 text-xs font-bold text-[var(--brand)]"><LockKeyhole className="size-4" />{pick(locale, "خاص", "Private")}</span>
        </header>
        <ChatPanel channel="support" initialMessages={messages} currentUserId={session.accountId} locale={locale} suggestions={[pick(locale, "عندي مشكلة في السباكة", "I have a plumbing issue"), pick(locale, "عندي مشكلة في الكهرباء", "I have an electrical issue"), pick(locale, "عندي استفسار عن الدفع", "I have a payment question")]} />
      </section>

      <aside className="grid content-start gap-4">
        <section className="surface p-5"><Wrench className="size-5 text-[var(--brand)]" /><h3 className="mt-4 font-bold">{pick(locale, "العطل محتاج فني؟", "Need a technician?")}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "المحادثة تساعدنا نفهم المشكلة، لكن طلب الصيانة هو اللي يضمن رقم متابعة وحالة وموعد زيارة.", "Chat helps us understand the issue, but a maintenance request provides tracking, status, and a visit window.")}</p><Link href="/my-maskan/maintenance" className="button-secondary mt-4 w-full"><Wrench className="size-4" />{pick(locale, "افتح طلب صيانة", "Create maintenance request")}</Link></section>
        <section className="surface p-5"><Phone className="size-5 text-[var(--terracotta)]" /><h3 className="mt-4 font-bold">{pick(locale, "مساعدة عاجلة", "Urgent help")}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "في حالة الخطر الفوري اتصل بخدمة الطوارئ المناسبة.", "For immediate danger, contact the appropriate emergency service.")}</p><p className="mt-4 font-bold" dir="ltr">+20 2 0000 0000</p><p className="mt-1 text-xs text-[var(--muted)]">{pick(locale, "رقم تجريبي فقط", "Illustrative POC number")}</p></section>
        <section className="rounded-lg bg-[#e8c2b3] p-5"><Headphones className="size-5 text-[#6e3827]" /><p className="mt-4 text-sm leading-6 text-[#6e3827]">{pick(locale, "هذه المحادثة بينك وبين فريق مسكن، ولا تظهر في شات الوحدة.", "This conversation is between you and the Maskan team and never appears in unit chat.")}</p></section>
      </aside>
    </div>
  );
}
