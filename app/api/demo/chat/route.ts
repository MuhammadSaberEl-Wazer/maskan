import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { properties } from "@/lib/data";
import { CHAT_MAX_ATTACHMENTS, storeDemoChatFile, validateDemoChatFile } from "@/lib/demo-chat-media";
import { getDemoBooking, getDemoChats, getDemoSession, setDemoChats, type DemoChatMessage } from "@/lib/demo-session";

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "resident") return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  let channel: "support" | "unit" | undefined;
  let text = "";
  let files: File[] = [];
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData().catch(() => null);
    const rawChannel = formData?.get("channel");
    channel = rawChannel === "support" || rawChannel === "unit" ? rawChannel : undefined;
    text = String(formData?.get("text") ?? "").trim();
    files = (formData?.getAll("attachments") ?? []).filter((value): value is File => value instanceof File && value.size > 0);
  } else {
    const body = (await request.json().catch(() => null)) as { channel?: "support" | "unit"; text?: string } | null;
    channel = body?.channel;
    text = body?.text?.trim() ?? "";
  }

  if (!channel || (!text && files.length === 0) || text.length > 300 || files.length > CHAT_MAX_ATTACHMENTS) {
    return NextResponse.json({ error: "invalid_message" }, { status: 400 });
  }

  try {
    await Promise.all(files.map(validateDemoChatFile));
  } catch (error) {
    const code = error instanceof Error ? error.message : "invalid_media";
    return NextResponse.json({ error: code }, { status: code === "media_too_large" ? 413 : 415 });
  }

  const booking = await getDemoBooking();
  const ownBooking = booking?.userId === session.accountId ? booking : null;
  const unitKey = ownBooking?.propertySlug ?? (!session.registeredInDemo ? "nasr-city-park" : undefined);
  const property = properties.find((item) => item.slug === unitKey);
  if (channel === "unit" && !unitKey) return NextResponse.json({ error: "no_active_stay" }, { status: 403 });

  const chats = await getDemoChats();
  const key = channel === "support" ? session.accountId : unitKey!;
  const attachments = await Promise.all(files.map((file) => storeDemoChatFile(file, { channel, scopeKey: key, area: property?.area })));
  const message: DemoChatMessage = {
    id: randomUUID(),
    authorId: session.accountId,
    authorName: session.language === "ar" ? session.fullNameAr : session.fullName,
    authorType: "resident",
    text,
    createdAt: new Date().toISOString(),
    propertySlug: property?.slug,
    area: property?.area,
    attachments,
  };
  const created = [message];

  if (channel === "support") {
    const reply: DemoChatMessage = {
      id: randomUUID(),
      authorId: "maskan-support",
      authorName: session.language === "ar" ? "دعم مسكن" : "Maskan Support",
      authorType: "support",
      text: session.language === "ar" ? "وصلتنا رسالتك. لو المشكلة محتاجة فني، افتح طلب صيانة علشان تاخد رقم متابعة وموعد زيارة." : "We received your message. If a technician is needed, create a maintenance request to get a tracking reference and visit window.",
      createdAt: new Date(Date.now() + 1).toISOString(),
    };
    created.push(reply);
  }

  const current = channel === "support" ? chats.support[key] ?? [] : chats.unit[key] ?? [];
  const updated = [...current, ...created].slice(-6);
  if (channel === "support") chats.support[key] = updated;
  else chats.unit[key] = updated;
  await setDemoChats(chats);

  return NextResponse.json({ ok: true, messages: created });
}
