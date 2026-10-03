import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

const stepKeys = ["read", "reply", "track"] as const;

export function NextStepsPanel() {
  const t = useTranslations("Submit.nextSteps");

  return (
    <aside aria-label={t("title")}>
      <Card className="flex flex-col gap-5 bg-tint p-6">
        <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
        <ol className="flex flex-col gap-4">
          {stepKeys.map((key, index) => (
            <li className="flex gap-3" key={key}>
              <span
                aria-hidden="true"
                className="grid size-8 flex-none place-items-center rounded-control bg-primary text-sm font-extrabold text-primary-foreground"
              >
                {index + 1}
              </span>
              <p className="text-foreground">{t(`steps.${key}`)}</p>
            </li>
          ))}
        </ol>
        <p className="text-sm text-muted">{t("privacy")}</p>
      </Card>
    </aside>
  );
}
