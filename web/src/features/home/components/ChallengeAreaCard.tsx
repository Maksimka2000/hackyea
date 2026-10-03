import type { LucideIcon } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

type ChallengeAreaCardProps = Readonly<{
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
}>;

export function ChallengeAreaCard({ description, href, icon: Icon, name }: ChallengeAreaCardProps) {
  return (
    <Card className="h-full transition-shadow duration-150 focus-within:shadow-card hover:border-primary hover:shadow-card">
      <Link className="flex h-full items-start gap-4 p-5" href={href}>
        <span aria-hidden="true" className="grid size-11 flex-none place-items-center rounded-control bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="font-bold leading-tight text-foreground">{name}</span>
          <span className="text-sm leading-snug text-muted">{description}</span>
        </span>
      </Link>
    </Card>
  );
}
