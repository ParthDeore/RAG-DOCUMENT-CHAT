import * as React from "react";
import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  processing: "bg-gold-500/15 text-gold-600",
  ready: "bg-emerald-500/15 text-emerald-700",
  failed: "bg-red-500/15 text-red-700",
};

export function Badge({
  status,
  children,
  className,
}: {
  status?: keyof typeof statusStyles;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase",
        status ? statusStyles[status] : "bg-paper-200 text-ink-700",
        className
      )}
    >
      {children}
    </span>
  );
}
