import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-32 w-full resize-y rounded-md border border-[#cfd6d1] bg-white px-3.5 py-3 text-sm leading-6 text-[var(--foreground)] shadow-[0_1px_2px_rgba(20,45,32,.04)] outline-none transition-[border-color,box-shadow] placeholder:text-[#929b95] hover:border-[#aebbb3] focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(40,89,67,.1)] disabled:cursor-not-allowed disabled:bg-[#f1f3f1]",
        className,
      )}
      {...props}
    />
  );
}
