"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Headphones, MessageCircle, Users, X } from "lucide-react";
import { ChatPanel } from "@/components/chat-panel";
import type { Locale } from "@/lib/demo-accounts";
import type { DemoChatMessage } from "@/lib/demo-session";

type ResidentChatDockProps = {
  locale: Locale;
  currentUserId: string;
  supportMessages: DemoChatMessage[];
  unitMessages: DemoChatMessage[];
  unitName?: string;
};

export function ResidentChatDock({ locale, currentUserId, supportMessages, unitMessages, unitName }: ResidentChatDockProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState<"support" | "unit">("support");
  const ar = locale === "ar";

  if (pathname === "/my-maskan/chat" || pathname === "/my-maskan/support") return null;

  return (
    <div className="fixed bottom-4 end-4 z-[70] sm:bottom-6 sm:end-6">
      {open && (
        <section role="dialog" aria-label={ar ? "محادثات مسكن" : "Maskan chats"} className="fixed inset-x-3 bottom-20 top-20 flex flex-col overflow-hidden rounded-lg border border-[#3d433f] bg-white shadow-[0_24px_70px_rgba(18,24,20,.28)] sm:inset-auto sm:bottom-24 sm:end-6 sm:h-[min(680px,calc(100vh-120px))] sm:w-[390px]">
          <header className="flex items-center justify-between gap-3 bg-[#242825] px-4 py-3 text-white">
            <div><p className="font-bold">{ar ? "محادثات مسكن" : "Maskan chats"}</p><p className="mt-0.5 text-xs text-white/55">{channel === "support" ? (ar ? "خاص مع فريق الدعم" : "Private with support") : unitName}</p></div>
            <button type="button" onClick={() => setOpen(false)} className="grid size-9 place-items-center rounded-md bg-white/10 hover:bg-white/20" aria-label={ar ? "إغلاق الشات" : "Close chat"}><X className="size-5" /></button>
          </header>
          <div className="grid grid-cols-2 gap-1 bg-[#dfe4e0] p-1">
            <button type="button" onClick={() => setChannel("support")} className={`flex min-h-10 items-center justify-center gap-2 rounded-md text-xs font-bold ${channel === "support" ? "bg-white text-[#25342d] shadow-sm" : "text-[#56615b]"}`}><Headphones className="size-4" />{ar ? "الدعم" : "Support"}</button>
            <button type="button" onClick={() => setChannel("unit")} disabled={!unitName} className={`flex min-h-10 items-center justify-center gap-2 rounded-md text-xs font-bold disabled:opacity-40 ${channel === "unit" ? "bg-white text-[#25342d] shadow-sm" : "text-[#56615b]"}`}><Users className="size-4" />{ar ? "سكان الوحدة" : "Residents"}</button>
          </div>
          <div className={channel === "support" ? "min-h-0 flex-1" : "hidden"}><ChatPanel channel="support" initialMessages={supportMessages} currentUserId={currentUserId} locale={locale} compact /></div>
          <div className={channel === "unit" ? "min-h-0 flex-1" : "hidden"}><ChatPanel channel="unit" initialMessages={unitMessages} currentUserId={currentUserId} locale={locale} compact /></div>
        </section>
      )}

      <button type="button" onClick={() => setOpen((value) => !value)} className="relative grid size-14 place-items-center rounded-full bg-[#242825] text-white shadow-[0_12px_30px_rgba(18,24,20,.28)] transition-transform hover:scale-[1.03]" aria-label={open ? (ar ? "إغلاق الشات" : "Close chat") : (ar ? "افتح الشات" : "Open chat")} title={ar ? "الشات" : "Chat"}>
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
        {!open && <span className="absolute end-0 top-0 size-3 rounded-full border-2 border-white bg-[var(--terracotta)]" />}
      </button>
    </div>
  );
}
