import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold",
  {
    variants: {
      variant: {
        neutral: "bg-surface text-muted ring-1 ring-inset ring-line",
        fuel: "bg-fuel-subtle text-fuel-foreground",
        parts: "bg-parts-subtle text-parts-foreground",
        service: "bg-service-subtle text-service-foreground",
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
