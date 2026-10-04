import type { ReactNode } from "react";

import { Card } from "@/shared/ui/primitives/Card";

type ChartCardProps = Readonly<{
  id: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}>;

export function ChartCard({ children, id, subtitle, title }: ChartCardProps) {
  return (
    <section aria-labelledby={id}>
      <Card className="flex flex-col gap-4 p-5">
        <div>
          <h2 className="text-xl font-bold text-foreground" id={id}>{title}</h2>
          {subtitle ? <p className="text-sm text-muted">{subtitle}</p> : null}
        </div>
        {children}
      </Card>
    </section>
  );
}
