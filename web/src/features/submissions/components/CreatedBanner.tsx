import { CircleCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

import { CopyLinkButton } from "./CopyLinkButton";

export function CreatedBanner() {
  const t = useTranslations("SubmissionStatus.created");

  return (
    <Card className="flex gap-4 border-primary bg-tint p-6" role="status">
      <CircleCheck aria-hidden="true" className="size-8 flex-none text-primary" />
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-extrabold text-foreground">{t("title")}</h2>
        <p className="text-foreground">{t("text")}</p>
        <p className="font-semibold text-foreground">{t("warning")}</p>
        <CopyLinkButton />
      </div>
    </Card>
  );
}
