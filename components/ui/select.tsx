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
        "flex h-12 w-full items-center justify-between gap-3 rounded-md border border-[#cfd6d1] bg-white px-3.5 text-sm font-semibold text-[var(--foreground)] shadow-[0_1px_2px_rgba(20,45,32,.04)] outline-none transition-[border-color,box-shadow] hover:border-[#aebbb3] focus:border-[var(--brand)] focus:ring-4 focus:ring-[rgba(40,89,67,.1)] data-[placeholder]:text-[#929b95] disabled:cursor-not-allowed disabled:bg-[#f1f3f1] [&>span]:truncate",
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
        sideOffset={6}
        className={cn(
          "z-[100] max-h-80 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-md border border-[#d7ddd8] bg-white text-[var(--foreground)] shadow-[0_18px_45px_rgba(19,40,29,.16)] data-[state=closed]:animate-out data-[state=open]:animate-in",
          className,
        )}
        {...props}
      >
        <SelectPrimitive.ScrollUpButton className="flex h-7 items-center justify-center bg-white"><ChevronUp className="size-4" /></SelectPrimitive.ScrollUpButton>
        <SelectPrimitive.Viewport className="p-1.5">{children}</SelectPrimitive.Viewport>
        <SelectPrimitive.ScrollDownButton className="flex h-7 items-center justify-center bg-white"><ChevronDown className="size-4" /></SelectPrimitive.ScrollDownButton>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

export function SelectItem({ className, children, ...props }: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex min-h-10 cursor-default select-none items-center rounded px-9 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-40 data-[highlighted]:bg-[#edf3ef] data-[highlighted]:text-[var(--brand-dark)]",
        className,
      )}
      {...props}
    >
      <span className="absolute start-2.5 flex size-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="size-4 text-[var(--brand)]" /></SelectPrimitive.ItemIndicator></span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}
