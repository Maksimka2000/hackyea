import { useTranslations } from "next-intl";

import { Container } from "@/shared/ui/primitives/Container";

import type { SubmissionType } from "../constants/submission-types";

type SubmitHeaderProps = Readonly<{
  type: SubmissionType;
}>;

export function SubmitHeader({ type }: SubmitHeaderProps) {
  const t = useTranslations("Submit.header");

  return (
    <section aria-labelledby="submit-title" className="on-dark bg-hero py-8 text-hero-foreground">
      <Container>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="submit-title">
          {t(`${type}.title`)}
        </h1>
        <p className="mt-2 max-w-3xl text-lg opacity-90">{t(`${type}.lead`)}</p>
      </Container>
    </section>
  );
}
