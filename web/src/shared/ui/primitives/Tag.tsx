import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type TagProps = ComponentProps<"span">;

export function Tag({ className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "border-line inline-flex w-fit rounded-full border-border bg-tint px-3 py-0.5 text-xs font-bold text-primary",
        className,
      )}
      {...props}
    />
  );
}
