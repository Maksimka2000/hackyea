import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Container } from "@/shared/ui/primitives/Container";

export function SubmissionNotFound() {
  const t = useTranslations("SubmissionStatus.notFound");

  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <SearchX aria-hidden="true" className="size-12 text-primary" />
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{t("title")}</h1>
      <p className="max-w-xl text-lg text-muted">{t("text")}</p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/submit?type=need" variant="primary">
          {t("cta")}
        </ButtonLink>
        <ButtonLink href="/" variant="outline">
          {t("home")}
        </ButtonLink>
      </div>
    </Container>
  );
}
