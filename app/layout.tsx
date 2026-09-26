import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { ResidentChatDock } from "@/components/resident-chat-dock";
import { properties } from "@/lib/data";
import { getDemoBooking, getDemoChats, getDemoSession, getLocale, type DemoChatMessage } from "@/lib/demo-session";
import { pick, propertyName } from "@/lib/i18n";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: {
    default: "مسكن | سرعة وثقة وأمان",
    template: "%s | Maskan",
  },
  description:
    "وحدات سكنية مُدارة في مصر تجمع بين السرعة والثقة والأمان، مع سعر واضح وعقود وصيانة ودعم.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [locale, session, booking, chats] = await Promise.all([getLocale(), getDemoSession(), getDemoBooking(), getDemoChats()]);
  const ownBooking = session && booking?.userId === session.accountId ? booking : null;
  const unitSlug = session?.role === "resident" ? ownBooking?.propertySlug ?? (!session.registeredInDemo ? "nasr-city-park" : undefined) : undefined;
  const unit = properties.find((property) => property.slug === unitSlug);
  const supportWelcome: DemoChatMessage | undefined = session?.role === "resident" ? {
    id: `dock-support-${session.accountId}`,
    authorId: "maskan-support",
    authorName: pick(locale, "دعم مسكن", "Maskan Support"),
    authorType: "support",
    text: pick(locale, "أهلا بك. ابعت سؤالك أو شكواك، ولو العطل محتاج فني افتح طلب صيانة للمتابعة.", "Welcome. Send your question or complaint; create a maintenance request when a technician is needed."),
    createdAt: "2026-09-26T08:00:00.000Z",
  } : undefined;
  const unitWelcome: DemoChatMessage | undefined = unit ? {
    id: `dock-unit-${unit.slug}`,
    authorId: "demo-representative-ahmed",
    authorName: pick(locale, "أحمد سمير · ممثل الوحدة", "Ahmed Samir · Unit representative"),
    authorType: "resident",
    text: pick(locale, "أهلا بكم في شات الوحدة للتنسيق اليومي والمناطق المشتركة.", "Welcome to the unit chat for daily and shared-area coordination."),
    createdAt: "2026-09-26T08:30:00.000Z",
  } : undefined;
  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} data-scroll-behavior="smooth">
      <body className={cairo.variable}>
        <Header />
        {children}
        {session?.role === "resident" && supportWelcome && <ResidentChatDock locale={locale} currentUserId={session.accountId} supportMessages={[supportWelcome, ...(chats.support[session.accountId] ?? [])]} unitMessages={unitWelcome && unit ? [unitWelcome, ...(chats.unit[unit.slug] ?? [])] : []} unitName={unit ? propertyName(unit.slug, unit.name, locale) : undefined} />}
      </body>
    </html>
  );
}
