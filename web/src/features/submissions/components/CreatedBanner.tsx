import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

type CreatedBannerProps = Readonly<{
  number: string;
}>;

export function CreatedBanner({ number }: CreatedBannerProps) {
  const t = useTranslations("MySubmission.created");

  return (
    <Card className="flex gap-4 border-primary bg-tint p-6" role="status">
      <CircleCheck aria-hidden="true" className="size-8 flex-none text-primary" />
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-extrabold text-foreground">{t("title")}</h2>
        <p className="text-foreground">{t("text", { number })}</p>
      </div>
    </Card>
  );
}
