import type { LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

type CategoryCardProps = Readonly<{
  name: string;
  href: string;
  icon: LucideIcon;
}>;

export function CategoryCard({ href, icon: Icon, name }: CategoryCardProps) {
  return (
    <Card className="h-full transition-shadow duration-150 focus-within:shadow-card hover:border-primary hover:shadow-card">
      <Link className="flex h-full items-center gap-4 p-5" href={href}>
        <span aria-hidden="true" className="grid size-11 flex-none place-items-center rounded-control bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <span className="font-bold leading-tight text-foreground">{name}</span>
      </Link>
    </Card>
  );
}
