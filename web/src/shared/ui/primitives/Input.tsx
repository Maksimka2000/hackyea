import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type InputProps = ComponentProps<"input">;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      className={cn(
        "block h-12 w-full rounded-control border-2 border-border bg-tint px-4 text-foreground placeholder:text-muted focus:border-primary focus:bg-surface aria-invalid:border-danger",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
