import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type SkeletonProps = ComponentProps<"div">;

/** Placeholder block shown while content loads. Pulses only when the user has not asked for reduced motion. */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("border-line rounded-control border-border bg-tint-strong motion-safe:animate-pulse", className)}
      {...props}
    />
  );
}
