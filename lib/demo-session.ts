import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { DemoRole, Locale } from "@/lib/demo-accounts";

export const SESSION_COOKIE = "maskan_demo_session";
export const LOCALE_COOKIE = "maskan_locale";
export const BOOKING_COOKIE = "maskan_demo_booking";
export const MAINTENANCE_COOKIE = "maskan_demo_maintenance";
export const CHAT_COOKIE = "maskan_demo_chats";

export type DemoSession = {
  accountId: string;
  fullName: string;
  fullNameAr: string;
  email: string;
  role: DemoRole;
  language: Locale;
  gender: "male" | "female";
  isUnitRepresentative: boolean;
  area?: string;
  registeredInDemo?: boolean;
};

export type DemoBooking = {
  reference: string;
  userId: string;
  bedId: string;
  propertySlug: string;
  propertyName: string;
  propertyCode: string;
  roomCode: string;
  bedCode: string;
  moveIn: string;
  duration: 1 | 3 | 6 | 12;
  monthlyPrice: number;
  depositAmount: number;
  createdAt: string;
};

export type DemoMaintenanceRequest = {
  reference: string;
  userId: string;
  category: string;
  priority: string;
  title: string;
  description: string;
  status: "submitted";
  createdAt: string;
};

export type DemoChatAttachment = {
  id: string;
  name: string;
  kind: "image" | "video";
  mimeType: string;
  size: number;
  url: string;
};

export type DemoChatMessage = {
  id: string;
  authorId: string;
  authorName: string;
  authorType: "resident" | "support" | "system";
  text: string;
  createdAt: string;
  propertySlug?: string;
  area?: string;
  attachments?: DemoChatAttachment[];
};

export type DemoChatStore = {
  support: Record<string, DemoChatMessage[]>;
  unit: Record<string, DemoChatMessage[]>;
};

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 8,
};

function secret() {
  return process.env.DEMO_AUTH_SECRET ?? "maskan-local-poc-secret-change-before-deployment";
}

export function seal(value: object) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  const signature = createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function unseal<T>(token: string | undefined): T | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (
    actualBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(actualBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as T;
  } catch {
    return null;
  }
}

export async function getDemoSession() {
  const store = await cookies();
  return unseal<DemoSession>(store.get(SESSION_COOKIE)?.value);
}

export async function setDemoSession(session: DemoSession) {
  const store = await cookies();
  store.set(SESSION_COOKIE, seal(session), cookieOptions);
  store.set(LOCALE_COOKIE, session.language, { ...cookieOptions, httpOnly: false, maxAge: 60 * 60 * 24 * 365 });
}

export async function clearDemoSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const explicit = store.get(LOCALE_COOKIE)?.value;
  if (explicit === "ar" || explicit === "en") return explicit;
  return "ar";
}

export async function setLocale(locale: Locale) {
  const store = await cookies();
  const current = unseal<DemoSession>(store.get(SESSION_COOKIE)?.value);
  store.set(LOCALE_COOKIE, locale, { ...cookieOptions, httpOnly: false, maxAge: 60 * 60 * 24 * 365 });
  if (current) store.set(SESSION_COOKIE, seal({ ...current, language: locale }), cookieOptions);
}

export async function getDemoBooking() {
  const store = await cookies();
  return unseal<DemoBooking>(store.get(BOOKING_COOKIE)?.value);
}

export async function setDemoBooking(booking: DemoBooking) {
  const store = await cookies();
  store.set(BOOKING_COOKIE, seal(booking), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function getDemoMaintenance() {
  const store = await cookies();
  return unseal<DemoMaintenanceRequest>(store.get(MAINTENANCE_COOKIE)?.value);
}

export async function setDemoMaintenance(request: DemoMaintenanceRequest) {
  const store = await cookies();
  store.set(MAINTENANCE_COOKIE, seal(request), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
}

export async function getDemoChats(): Promise<DemoChatStore> {
  const store = await cookies();
  return unseal<DemoChatStore>(store.get(CHAT_COOKIE)?.value) ?? { support: {}, unit: {} };
}

export async function setDemoChats(chats: DemoChatStore) {
  const store = await cookies();
  store.set(CHAT_COOKIE, seal(chats), { ...cookieOptions, maxAge: 60 * 60 * 24 * 30 });
}

export function isOperationsRole(role: DemoRole) {
  return role === "staff" || role === "area_manager" || role === "admin";
}
