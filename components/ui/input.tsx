import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full rounded-md border border-[#cfd6d1] bg-white px-3.5 py-2 text-sm text-[var(--foreground)] shadow-[0_1px_2px_rgba(20,45,32,.04)] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#929b95] hover:border-[#aebbb3] focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(40,89,67,.1)] disabled:cursor-not-allowed disabled:bg-[#f1f3f1] disabled:text-[var(--muted)]",
        className,
      )}
      {...props}
    />
  );
}
