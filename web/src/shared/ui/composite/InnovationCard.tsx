import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";
import { Tag } from "@/shared/ui/primitives/Tag";

type InnovationCardProps = Readonly<{
  id: string;
  title: string;
  summary: string;
  /** Omitted where the category is already clear from the context (the library page groups by category). */
  categoryName?: string;
  /** Mark of cards chosen for wider dissemination. */
  badge?: string | null;
  /** Translated link text, for example "Zobacz rozwiązanie". */
  viewLabel: string;
}>;

/** Catalogue card used wherever innovations are listed as suggestions (home page, related solutions). */
export function InnovationCard({ badge, categoryName, id, summary, title, viewLabel }: InnovationCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex flex-1 flex-col gap-3 p-6">
        {categoryName ? <Tag>{categoryName}</Tag> : null}
        {badge ? <Tag>{badge}</Tag> : null}
        <h3 className="text-xl leading-tight font-bold text-foreground">{title}</h3>
        {summary ? <p className="flex-1 text-muted">{summary}</p> : <span className="flex-1" />}
        <Link className="inline-flex items-center gap-2 font-bold text-primary underline underline-offset-4" href={`/library/${id}`}>
          {viewLabel}
          <span className="sr-only"> – {title}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
