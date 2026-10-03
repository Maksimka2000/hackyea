import { Info } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";

/** Shown above the results when even the best match is weak. The cards below are still the nearest ones. */
export function LowConfidenceNotice() {
  const t = useTranslations("Search.lowConfidence");

  return (
    <Card className="flex flex-col items-start gap-3 bg-tint p-6">
      <div className="flex items-center gap-3">
        <Info aria-hidden="true" className="size-7 flex-none text-primary" />
        <h2 className="text-xl font-extrabold text-foreground">{t("title")}</h2>
      </div>
      <p className="max-w-2xl text-muted">{t("text")}</p>
      <ButtonLink href="/submit?type=need" variant="outline">
        {t("cta")}
      </ButtonLink>
    </Card>
  );
}
