import { NextResponse } from "next/server";
import { findSpace, getBookingQuote, type DurationMonths } from "@/lib/data";
import { getDemoSession, setDemoBooking, type DemoBooking } from "@/lib/demo-session";

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "resident") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { bedId?: string; duration?: number; moveIn?: string }
    | null;
  if (!body?.bedId || ![1, 3, 6, 12].includes(body.duration ?? 0) || !body.moveIn) {
    return NextResponse.json({ error: "invalid_booking" }, { status: 400 });
  }

  const result = findSpace(body.bedId);
  if (!result || result.space.availableBeds === 0) {
    return NextResponse.json({ error: "space_unavailable" }, { status: 409 });
  }

  const duration = body.duration as DurationMonths;
  const quote = getBookingQuote(result.space.monthlyPrice, duration);
  const booking: DemoBooking = {
    reference: `MSK-DEMO-${result.property.code.slice(-3)}-${result.space.bedCode}`,
    userId: session.accountId,
    bedId: result.space.id,
    propertySlug: result.property.slug,
    propertyName: result.property.name,
    propertyCode: result.property.code,
    roomCode: result.space.roomCode,
    bedCode: result.space.bedCode,
    moveIn: body.moveIn,
    duration,
    monthlyPrice: quote.monthlyPrice,
    depositAmount: quote.depositAmount,
    createdAt: new Date().toISOString(),
  };
  await setDemoBooking(booking);

  return NextResponse.json({ ok: true, reference: booking.reference });
}
