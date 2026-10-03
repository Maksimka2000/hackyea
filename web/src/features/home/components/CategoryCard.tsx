import type { LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

type CategoryCardProps = Readonly<{
  name: string;
  /** Translated number of solutions, for example "20 rozwiązań". */
  countLabel: string;
  href: string;
  icon: LucideIcon;
}>;

export function CategoryCard({ countLabel, href, icon: Icon, name }: CategoryCardProps) {
  return (
    <Card className="h-full transition-shadow duration-150 focus-within:shadow-card hover:border-primary hover:shadow-card">
      <Link className="flex h-full items-center gap-4 p-5" href={href}>
        <span aria-hidden="true" className="grid size-11 flex-none place-items-center rounded-control bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <span className="flex flex-col">
          <span className="leading-tight font-bold text-foreground">{name}</span>
          <span className="text-sm text-muted">{countLabel}</span>
        </span>
      </Link>
    </Card>
  );
}
