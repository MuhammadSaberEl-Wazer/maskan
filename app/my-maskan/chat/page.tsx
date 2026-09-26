import Link from "next/link";
import { Home, LockKeyhole, ShieldCheck, Users } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import { properties } from "@/lib/data";
import { getDemoBooking, getDemoChats, getDemoSession, getLocale, type DemoChatMessage } from "@/lib/demo-session";
import { pick, propertyName } from "@/lib/i18n";

export default async function UnitChatPage() {
  const [session, booking, chats, locale] = await Promise.all([getDemoSession(), getDemoBooking(), getDemoChats(), getLocale()]);
  if (!session) return null;

  const ownBooking = booking?.userId === session.accountId ? booking : null;
  const propertySlug = ownBooking?.propertySlug ?? (!session.registeredInDemo ? "nasr-city-park" : undefined);
  const property = properties.find((item) => item.slug === propertySlug);

  if (!property) {
    return (
      <section className="surface grid min-h-80 place-items-center p-8 text-center">
        <div><Home className="mx-auto size-10 text-[var(--brand)]" /><h2 className="mt-5 text-2xl font-bold">{pick(locale, "شات الوحدة يتفتح بعد تأكيد السكن", "Unit chat opens after your stay is confirmed")}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">{pick(locale, "بعد الحجز هتدخل تلقائيا على مجموعة سكان وحدتك فقط.", "After booking, you will automatically join your residence-only group.")}</p><Link href="/explore" className="button-primary mt-6">{pick(locale, "دور على سكن", "Find a residence")}</Link></div>
      </section>
    );
  }

  const starterMessages: DemoChatMessage[] = [
    {
      id: `welcome-${property.slug}`,
      authorId: "demo-representative-ahmed",
      authorName: pick(locale, "أحمد سمير · ممثل الوحدة", "Ahmed Samir · Unit representative"),
      authorType: "resident",
      text: pick(locale, "أهلا بكم في شات الوحدة. نستخدمه للتنسيق اليومي والمناطق المشتركة، وأي عطل محتاج فني نسجله في الصيانة.", "Welcome to the unit chat. This is for daily coordination and common areas; issues needing a technician should be logged in Maintenance."),
      createdAt: "2026-09-26T08:30:00.000Z",
    },
  ];
  const messages = [...starterMessages, ...(chats.unit[property.slug] ?? [])];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
      <section className="surface overflow-hidden">
        <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] p-5">
          <div><p className="eyebrow">{pick(locale, "سكان نفس الوحدة", "Residents of the same unit")}</p><h2 className="mt-1 text-xl font-bold">{propertyName(property.slug, property.name, locale)}</h2></div>
          <span className="flex items-center gap-2 rounded-md bg-[#edf6f0] px-3 py-2 text-xs font-bold text-[var(--brand)]"><Users className="size-4" />{pick(locale, "مجموعة خاصة", "Private group")}</span>
        </header>
        <ChatPanel channel="unit" initialMessages={messages} currentUserId={session.accountId} locale={locale} suggestions={[pick(locale, "موعد التنظيف إمتى؟", "When is the cleaning visit?"), pick(locale, "حد عنده ملاحظة على المطبخ؟", "Any notes about the kitchen?")]} />
      </section>

      <aside className="grid content-start gap-4">
        <section className="surface p-5"><LockKeyhole className="size-5 text-[var(--brand)]" /><h3 className="mt-4 font-bold">{pick(locale, "مين يقدر يشوف الشات؟", "Who can see this chat?")}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "المقيمون المرتبطون بنفس الوحدة فقط. الرسائل لا تظهر لسكان الوحدات الأخرى.", "Only residents linked to this property. Messages are not visible to residents of other properties.")}</p></section>
        <section className="surface p-5"><ShieldCheck className="size-5 text-[var(--terracotta)]" /><h3 className="mt-4 font-bold">{pick(locale, "استخدام آمن وواضح", "Safe, clear use")}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{pick(locale, "لا تشارك بيانات الهوية أو الدفع. الشكاوى الخاصة تروح للدعم، والأعطال تروح لطلب صيانة برقم متابعة.", "Do not share identity or payment data. Private complaints go to Support, and repairs go to a tracked maintenance request.")}</p></section>
      </aside>
    </div>
  );
}
