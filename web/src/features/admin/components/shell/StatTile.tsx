import type { ReactNode } from "react";

import { Card } from "@/shared/ui/primitives/Card";

type StatTileProps = Readonly<{
  label: string;
  value: ReactNode;
  hint?: string;
  emphasis?: boolean;
}>;

/** One headline figure: a short label above, the value large, an optional note below. */
export function StatTile({ emphasis = false, hint, label, value }: StatTileProps) {
  return (
    <Card className={emphasis ? "border-primary bg-tint p-5" : "p-5"}>
      <p className="text-sm font-bold text-muted">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-foreground tabular-nums">{value}</p>
      {hint ? <p className="mt-1 text-sm text-muted">{hint}</p> : null}
    </Card>
  );
}
