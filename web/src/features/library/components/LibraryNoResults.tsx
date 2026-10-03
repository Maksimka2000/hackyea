import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";

type LibraryNoResultsProps = Readonly<{
  onReset: () => void;
}>;

export function LibraryNoResults({ onReset }: LibraryNoResultsProps) {
  const t = useTranslations("Library.filters");

  return (
    <div className="flex flex-col items-start gap-3">
      <h2 className="text-2xl font-extrabold text-foreground">{t("noResultsTitle")}</h2>
      <p className="max-w-xl text-muted">{t("noResultsText")}</p>
      <Button onClick={onReset} variant="outline">
        {t("reset")}
      </Button>
    </div>
  );
}
