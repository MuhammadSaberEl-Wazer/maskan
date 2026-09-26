import { NextResponse } from "next/server";
import { getDemoAccount } from "@/lib/demo-accounts";
import { setDemoSession, type DemoSession } from "@/lib/demo-session";

function safeNext(value: unknown, role: DemoSession["role"]) {
  if (typeof value === "string" && value.startsWith("/") && !value.startsWith("//")) return value;
  return role === "resident" ? "/my-maskan" : "/admin";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; accountId?: string; next?: string }
    | null;
  const account = getDemoAccount(body?.accountId ?? body?.email ?? "");

  if (!account || (!body?.accountId && body?.password !== account.password)) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
  }

  const session: DemoSession = {
    accountId: account.id,
    fullName: account.fullName,
    fullNameAr: account.fullNameAr,
    email: account.email,
    role: account.role,
    language: account.preferredLanguage,
    gender: account.gender,
    isUnitRepresentative: account.isUnitRepresentative,
    area: account.area,
  };
  await setDemoSession(session);

  return NextResponse.json({ ok: true, redirectTo: safeNext(body?.next, account.role) });
}
