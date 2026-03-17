import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-[#EDF2F9] text-[#586A85]",
        fuel: "bg-[#DFF5E8] text-[#17854B]",
        parts: "bg-[#FFEEDB] text-[#C46000]",
        service: "bg-[#DEE9FF] text-[#275EC7]",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
