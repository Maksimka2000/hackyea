import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";
import { MediaPlaceholder } from "@/shared/ui/primitives/MediaPlaceholder";
import { Tag } from "@/shared/ui/primitives/Tag";

import type { FeaturedInnovation } from "../types/featured-innovation";

type InnovationCardProps = Readonly<{
  innovation: FeaturedInnovation;
}>;

export function InnovationCard({ innovation }: InnovationCardProps) {
  const t = useTranslations("Home.featured");

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <MediaPlaceholder className="aspect-3/2" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Tag>{innovation.categoryName}</Tag>
        <h3 className="text-xl leading-tight font-bold text-foreground">{innovation.title}</h3>
        <p className="flex-1 text-muted">{innovation.summary}</p>
        <Link className="inline-flex items-center gap-2 font-bold text-primary underline underline-offset-4" href={`/library/${innovation.id}`}>
          {t("viewSolution")}
          <span className="sr-only"> – {innovation.title}</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </Card>
  );
}
