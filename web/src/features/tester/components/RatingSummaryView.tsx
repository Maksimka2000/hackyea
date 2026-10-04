import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

import type { RatingSummary } from "../schemas/testerDtoSchema";

type RatingSummaryViewProps = Readonly<{
  summary: RatingSummary | undefined;
}>;

export function RatingSummaryView({ summary }: RatingSummaryViewProps) {
  const t = useTranslations("Tester.summary");

  if (!summary) {
    return <p className="text-sm text-muted">{t("loading")}</p>;
  }

  if (summary.count === 0 || summary.average === null) {
    return <p className="text-sm text-muted">{t("none")}</p>;
  }

  return (
    <p className="flex items-center gap-2 text-foreground">
      <Star aria-hidden="true" className="size-5 fill-accent text-accent-foreground" />
      <span className="text-2xl font-extrabold">{summary.average.toFixed(1)}</span>
      <span className="text-sm text-muted">{t("count", { count: summary.count })}</span>
    </p>
  );
}
