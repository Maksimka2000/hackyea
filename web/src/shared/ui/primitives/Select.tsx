import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type SelectProps = ComponentProps<"select">;

/** Native select (best keyboard and screen-reader support), styled to match the other inputs. */
export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "block h-12 w-full rounded-control border-2 border-border bg-tint px-4 text-foreground focus:border-primary focus:bg-surface aria-invalid:border-danger",
        className,
      )}
      {...props}
    />
  );
}
