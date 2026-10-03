import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";
import { Container } from "@/shared/ui/primitives/Container";

export function SubmitCallout() {
  const t = useTranslations("Home.submitCallout");

  return (
    <section aria-labelledby="submit-callout-title" className="mt-20">
      <Container>
        <Card className="flex flex-col gap-6 rounded-panel bg-tint p-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground" id="submit-callout-title">
              {t("title")}
            </h2>
            <p className="mt-2 text-muted">{t("text")}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/submit?type=need" variant="primary">
              {t("needCta")}
            </ButtonLink>
            <ButtonLink href="/submit?type=idea" variant="outline">
              {t("ideaCta")}
            </ButtonLink>
          </div>
        </Card>
      </Container>
    </section>
  );
}
