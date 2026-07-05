import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export const FILTER_CONTROL_CLASS =
  "h-12 rounded-xl border border-line bg-field py-2 pr-3 pl-9 text-sm text-foreground transition-[border-color,box-shadow] hover:border-line-strong focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function FilterField({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("relative", className)}>
      <Icon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" />
      {children}
    </div>
  );
}

export { FilterField };
