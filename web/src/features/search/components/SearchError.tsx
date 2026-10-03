import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SearchErrorReason } from "../types/search-view-state";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";

type SearchErrorProps = Readonly<{
  reason: SearchErrorReason;
  onRetry: () => void;
}>;

export function SearchError({ reason, onRetry }: SearchErrorProps) {
  const t = useTranslations("Search.error");

  return (
    <Card className="flex flex-col items-start gap-4 p-8" role="alert">
      <TriangleAlert aria-hidden="true" className="size-10 text-danger" />
      <h2 className="text-2xl font-extrabold text-foreground">{t(`${reason}.title`)}</h2>
      <p className="max-w-xl text-muted">{t(`${reason}.text`)}</p>
      {reason === "invalid" ? null : (
        <Button onClick={onRetry} variant="outline">
          {t("retry")}
        </Button>
      )}
    </Card>
  );
}
