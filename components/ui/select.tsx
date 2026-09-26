"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;

export function SelectTrigger({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Trigger>) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "flex h-12 w-full items-center justify-between gap-3 rounded-md border border-[#cfd6d1] bg-white px-3.5 text-start text-sm font-semibold text-[var(--foreground)] shadow-[0_1px_2px_rgba(20,45,32,.04)] outline-none transition-[border-color,box-shadow] hover:border-[#aebbb3] focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(40,89,67,.1)] data-[placeholder]:text-[#929b95] disabled:cursor-not-allowed disabled:bg-[#f1f3f1] [&>span]:truncate [&>span]:text-start",
        className,
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild><ChevronDown className="size-4 shrink-0 text-[var(--muted)]" /></SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, position = "popper", ...props }: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        position={position}
        sideOffset={8}
        collisionPadding={12}
        className={cn(
          "z-[100] max-h-[min(22rem,var(--radix-select-content-available-height))] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-[#cfd7d1] bg-[#fbfcfa] text-[var(--foreground)] shadow-[0_20px_55px_rgba(16,35,25,.22)]",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-9 items-center justify-center border-b border-[var(--line)] bg-white"><ChevronUp className="size-4" /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-2">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-9 items-center justify-center border-t border-[var(--line)] bg-white"><ChevronDown className="size-4" /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-12 cursor-default select-none items-center rounded-md border-b border-[#e9ece9] px-10 py-2.5 text-start text-sm font-semibold outline-none last:border-b-0 data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[state=checked]:bg-[#e7efe9] data-[state=checked]:text-[var(--brand-dark)] data-[highlighted]:bg-[#edf3ef] data-[highlighted]:text-[var(--brand-dark)]",
        className,
      )}
      {...props}
    >
      <span className="absolute start-3 flex size-5 items-center justify-center rounded-full data-[state=checked]:bg-white"><SelectPrimitive.ItemIndicator><Check className="size-4 text-[var(--brand)]" strokeWidth={2.5} /></SelectPrimitive.ItemIndicator></span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
