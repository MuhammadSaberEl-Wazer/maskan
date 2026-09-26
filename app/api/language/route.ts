import { NextResponse } from "next/server";
import { setLocale } from "@/lib/demo-session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { locale?: string } | null;
  if (body?.locale !== "ar" && body?.locale !== "en") {
    return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
  }
  await setLocale(body.locale);
  return NextResponse.json({ ok: true });
}
