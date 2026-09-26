import Link from "next/link";
import { Building2, CircleUserRound, House, LayoutDashboard, LogIn } from "lucide-react";
import { LanguageSwitch } from "@/components/language-switch";
import { LogoutButton } from "@/components/session-actions";
import { getDemoSession, getLocale, isOperationsRole } from "@/lib/demo-session";

export async function Header() {
  const [locale, session] = await Promise.all([getLocale(), getDemoSession()]);
  const ar = locale === "ar";
  const operations = session ? isOperationsRole(session.role) : false;

  const navItems = [
    { href: "/explore", label: ar ? "دور على سكن" : "Find a residence", icon: House },
    ...(session?.role === "resident"
      ? [{ href: "/my-maskan", label: ar ? "مسكني" : "My Maskan", icon: Building2 }]
      : []),
    ...(operations
      ? [{ href: "/admin", label: ar ? "التشغيل" : "Operations", icon: LayoutDashboard }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(246,245,241,.94)] backdrop-blur-xl">
      <div className="shell flex h-16 items-center justify-between gap-2">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={ar ? "الصفحة الرئيسية لمسكن" : "Maskan home"}>
          <span className="grid size-9 place-items-center bg-[#252725] text-sm font-black text-white">م</span>
          <span>
            <span className="block text-[0.95rem] font-black tracking-[0.1em]">MASKAN</span>
            <span className="hidden text-[0.62rem] font-semibold text-[var(--muted)] sm:block">{ar ? "سكن مُدار" : "MANAGED LIVING"}</span>
          </span>
        </Link>

        <div className="flex min-w-0 items-center gap-0.5">
          <nav className="hidden items-center gap-0.5 md:flex" aria-label={ar ? "التنقل الرئيسي" : "Main navigation"}>
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex min-h-10 items-center gap-2 rounded-md px-2.5 text-sm font-semibold text-[var(--muted)] transition-colors hover:bg-white hover:text-[var(--foreground)] sm:px-3">
                <Icon aria-hidden="true" className="size-4 text-[#7b847f]" strokeWidth={1.8} />
                <span className="hidden lg:inline">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="ms-1 flex items-center gap-1 border-s border-[var(--line)] ps-1">
            <LanguageSwitch locale={locale} />
            {session ? (
              <>
                <Link href="/profile" className="flex min-h-10 items-center gap-2 rounded-md border border-[#727c76] bg-[#5d6862] px-2.5 text-xs font-bold text-white hover:bg-[#4f5a54]" title={session.email} aria-label={ar ? "افتح الملف الشخصي" : "Open profile"}>
                  <CircleUserRound className="size-4 text-[#f2f5f3]" />
                  <span className="hidden max-w-24 truncate sm:inline">{ar ? session.fullNameAr : session.fullName}</span>
                </Link>
                <LogoutButton locale={locale} />
              </>
            ) : (
              <Link href="/login" className="flex min-h-10 items-center gap-2 rounded-md bg-[var(--terracotta)] px-3 text-sm font-bold text-white transition-colors hover:bg-[#a9573e]">
                <LogIn className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{ar ? "دخول" : "Sign in"}</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
