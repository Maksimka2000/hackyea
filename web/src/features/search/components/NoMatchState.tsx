import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";

export function NoMatchState() {
  const t = useTranslations("Search.noMatch");

  return (
    <Card className="flex flex-col items-start gap-4 p-8">
      <SearchX aria-hidden="true" className="size-10 text-primary" />
      <h2 className="text-2xl font-extrabold text-foreground">{t("title")}</h2>
      <p className="max-w-xl text-muted">{t("text")}</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/submit?type=need" variant="primary">
          {t("submitNeed")}
        </ButtonLink>
        <ButtonLink href="/library" variant="outline">
          {t("browseLibrary")}
        </ButtonLink>
      </div>
    </Card>
  );
}
