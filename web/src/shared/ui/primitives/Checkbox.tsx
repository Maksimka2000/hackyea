import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

type CheckboxProps = Omit<ComponentProps<"input">, "type">;

export function Checkbox({ className, ...props }: CheckboxProps) {
  return <input className={cn("mt-0.5 size-6 flex-none accent-primary", className)} type="checkbox" {...props} />;
}
