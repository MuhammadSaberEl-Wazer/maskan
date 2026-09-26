import { NextResponse } from "next/server";
import { properties } from "@/lib/data";
import { readDemoChatMedia } from "@/lib/demo-chat-media";
import { getDemoBooking, getDemoSession, isOperationsRole } from "@/lib/demo-session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getDemoSession();
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id } = await params;
  const media = await readDemoChatMedia(id);
  if (!media) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let allowed = false;
  if (media.metadata.channel === "support") {
    allowed = media.metadata.scopeKey === session.accountId
      || (isOperationsRole(session.role) && (!session.area || session.area === media.metadata.area));
  } else if (session.role === "resident") {
    const booking = await getDemoBooking();
    const ownBooking = booking?.userId === session.accountId ? booking : null;
    const propertySlug = ownBooking?.propertySlug ?? (!session.registeredInDemo ? "nasr-city-park" : undefined);
    const propertyExists = properties.some((property) => property.slug === propertySlug);
    allowed = propertyExists && propertySlug === media.metadata.scopeKey;
  }

  if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  return new Response(new Uint8Array(media.bytes), {
    headers: {
      "Content-Type": media.metadata.mimeType,
      "Content-Length": String(media.bytes.length),
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
