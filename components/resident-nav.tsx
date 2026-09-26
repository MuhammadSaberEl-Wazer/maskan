import Link from "next/link";
import { CreditCard, FileText, House, LifeBuoy, MessageCircle, Wrench } from "lucide-react";
import type { Locale } from "@/lib/demo-accounts";

export function ResidentNav({ locale }: { locale: Locale }) {
  const ar = locale === "ar";
  const localizedItems = [
    { href: "/my-maskan", label: ar ? "نظرة عامة" : "Overview", icon: House },
    { href: "/my-maskan/payments", label: ar ? "الدفعات" : "Payments", icon: CreditCard },
    { href: "/my-maskan/maintenance", label: ar ? "الصيانة" : "Maintenance", icon: Wrench },
    { href: "/my-maskan/contract", label: ar ? "العقد" : "Contract", icon: FileText },
    { href: "/my-maskan/chat", label: ar ? "شات الوحدة" : "Unit chat", icon: MessageCircle },
    { href: "/my-maskan/support", label: ar ? "الدعم" : "Support", icon: LifeBuoy },
  ];
  return (
    <nav className="mb-7 flex gap-1 overflow-x-auto border-b border-[var(--line)]" aria-label="Resident portal">
      {localizedItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex min-h-11 shrink-0 items-center gap-2 border-b-2 border-transparent px-3 text-sm font-bold text-[var(--muted)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
        >
          <Icon className="size-4" aria-hidden="true" /> {label}
        </Link>
      ))}
    </nav>
  );
}
