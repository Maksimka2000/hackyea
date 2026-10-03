import { ArrowRight } from "lucide-react";

import { Card } from "@/shared/ui/primitives/Card";

type StepCardProps = Readonly<{
  position: number;
  title: string;
  text: string;
  hasConnector: boolean;
}>;

export function StepCard({ hasConnector, position, text, title }: StepCardProps) {
  return (
    <Card className="relative h-full p-6">
      <span
        aria-hidden="true"
        className="mb-4 grid size-10 place-items-center rounded-control bg-primary font-extrabold text-primary-foreground"
      >
        {position}
      </span>
      <h3 className="mb-1 text-xl font-bold text-foreground">{title}</h3>
      <p className="text-muted">{text}</p>
      {hasConnector ? (
        <ArrowRight aria-hidden="true" className="absolute top-8 -right-5 z-10 hidden size-5 text-primary md:block" />
      ) : null}
    </Card>
  );
}
