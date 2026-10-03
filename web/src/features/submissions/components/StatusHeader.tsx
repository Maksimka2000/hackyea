import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

import type { SubmissionView } from "../types/submission-view";

type StatusHeaderProps = Readonly<{
  submission: SubmissionView;
}>;

export function StatusHeader({ submission }: StatusHeaderProps) {
  const t = useTranslations("SubmissionStatus");

  return (
    <section aria-labelledby="status-title" className="on-dark bg-hero py-8 text-hero-foreground">
      <Container>
        <p className="mb-2 text-sm font-bold tracking-wide uppercase opacity-90">{t(`type.${submission.type}`)}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="status-title">
          {t("header.title")}
        </h1>
        <p className="mt-2 text-lg opacity-90">{t("header.reference", { reference: submission.reference })}</p>
      </Container>
    </section>
  );
}
