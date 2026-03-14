import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-24 w-full rounded-xl border border-[#D3DCEA] bg-[#F8FBFF] px-3 py-2 text-base text-[#101C33] placeholder:text-[#8CA0BC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3A8DFF]/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
