import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { setDemoSession, type DemoSession } from "@/lib/demo-session";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { fullName?: string; email?: string; password?: string; language?: string; gender?: string }
    | null;

  if (
    !body?.fullName?.trim() ||
    !body.email?.includes("@") ||
    !body.password ||
    body.password.length < 8 ||
    !["ar", "en"].includes(body.language ?? "") ||
    !["male", "female"].includes(body.gender ?? "")
  ) {
    return NextResponse.json({ error: "invalid_registration" }, { status: 400 });
  }

  const session: DemoSession = {
    accountId: `registered-${randomUUID()}`,
    fullName: body.fullName.trim(),
    fullNameAr: body.fullName.trim(),
    email: body.email.toLowerCase(),
    role: "resident",
    language: body.language as "ar" | "en",
    gender: body.gender as "male" | "female",
    isUnitRepresentative: false,
    registeredInDemo: true,
  };
  await setDemoSession(session);

  return NextResponse.json({ ok: true, redirectTo: "/explore" });
}
