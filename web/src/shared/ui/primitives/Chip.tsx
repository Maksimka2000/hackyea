import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type ChipProps = ComponentProps<"button">;

export function Chip({ className, type = "button", ...props }: ChipProps) {
  return (
    <button
      className={cn(
        "border-line rounded-control border-border bg-tint px-3 py-2 text-left text-sm leading-snug text-foreground transition-colors duration-150 hover:border-primary",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
