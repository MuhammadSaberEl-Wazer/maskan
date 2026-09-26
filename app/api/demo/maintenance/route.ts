import { NextResponse } from "next/server";
import { getDemoSession, setDemoMaintenance, type DemoMaintenanceRequest } from "@/lib/demo-session";

export async function POST(request: Request) {
  const session = await getDemoSession();
  if (!session || session.role !== "resident") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as
    | { category?: string; priority?: string; title?: string; description?: string }
    | null;
  if (!body?.category || !body.priority || !body.title?.trim() || !body.description?.trim()) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const maintenance: DemoMaintenanceRequest = {
    reference: `MR-DEMO-${String(Date.now()).slice(-5)}`,
    userId: session.accountId,
    category: body.category,
    priority: body.priority,
    title: body.title.trim(),
    description: body.description.trim(),
    status: "submitted",
    createdAt: new Date().toISOString(),
  };
  await setDemoMaintenance(maintenance);

  return NextResponse.json({ ok: true, reference: maintenance.reference });
}
