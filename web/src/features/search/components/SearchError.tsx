import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";

type SearchErrorProps = Readonly<{
  isRateLimited: boolean;
  onRetry: () => void;
}>;

export function SearchError({ isRateLimited, onRetry }: SearchErrorProps) {
  const t = useTranslations("Search.error");
  const messageKey = isRateLimited ? "rateLimited" : "generic";

  return (
    <Card className="flex flex-col items-start gap-4 p-8" role="alert">
      <TriangleAlert aria-hidden="true" className="size-10 text-danger" />
      <h2 className="text-2xl font-extrabold text-foreground">{t(`${messageKey}.title`)}</h2>
      <p className="max-w-xl text-muted">{t(`${messageKey}.text`)}</p>
      <Button onClick={onRetry} variant="outline">
        {t("retry")}
      </Button>
    </Card>
  );
}
