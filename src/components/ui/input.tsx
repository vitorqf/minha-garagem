import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full rounded-xl border border-line bg-field px-3.5 text-sm text-foreground transition-[border-color,box-shadow] placeholder:text-subtle hover:border-line-strong focus-visible:border-primary focus-visible:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
