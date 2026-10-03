import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type TextareaProps = ComponentProps<"textarea">;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "block min-h-36 w-full resize-y rounded-control border-2 border-border bg-tint px-4 py-3 text-foreground placeholder:text-muted focus:border-primary focus:bg-surface aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
