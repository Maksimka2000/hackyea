import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

type SurfaceProps = Readonly<{
  children: ReactNode;
  className?: string;
  title?: string;
}>;

export function Surface({ children, className, title }: SurfaceProps) {
  return (
    <section className={cn("surface-card animate-rise", className)}>
      {title ? <h2 className="text-lg font-semibold text-foreground">{title}</h2> : null}
      <div className="text-sm leading-6 text-muted-foreground">{children}</div>
    </section>
  );
}

