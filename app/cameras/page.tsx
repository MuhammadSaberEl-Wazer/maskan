import { redirect } from "next/navigation";
import { getDemoSession, isOperationsRole } from "@/lib/demo-session";

export default async function CamerasRedirectPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");
  redirect(isOperationsRole(session.role) ? "/admin#cameras" : "/my-maskan#cameras");
}
