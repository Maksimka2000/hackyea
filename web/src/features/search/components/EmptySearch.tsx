import { PenLine } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";

/** Shown when the results page is opened without a problem description. */
export function EmptySearch() {
  const t = useTranslations("Search.emptySearch");

  return (
    <Card className="flex flex-col items-start gap-4 p-8">
      <PenLine aria-hidden="true" className="size-10 text-primary" />
      <h2 className="text-2xl font-extrabold text-foreground">{t("title")}</h2>
      <p className="max-w-xl text-muted">{t("text")}</p>
      <ButtonLink href="/" variant="primary">
        {t("cta")}
      </ButtonLink>
    </Card>
  );
}
