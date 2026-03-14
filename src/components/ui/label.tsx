"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn("text-base font-semibold text-[#334155]", className)}
      {...props}
    />
  );
}

export { Label };
