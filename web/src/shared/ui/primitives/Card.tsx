import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type CardProps = ComponentProps<"div">;

export function Card({ className, ...props }: CardProps) {
  return <div className={cn("border-line rounded-card border-border bg-surface", className)} {...props} />;
}
