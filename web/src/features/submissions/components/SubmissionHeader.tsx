import { useTranslations } from "next-intl";

import { StatusBadge } from "@/shared/submissions/StatusBadge";
import type { SubmissionStatus, SubmissionType } from "@/shared/submissions/submissionModel";
import { Container } from "@/shared/ui/primitives/Container";

type SubmissionHeaderProps = Readonly<{
  number: string;
  title: string;
  type: SubmissionType;
  status: SubmissionStatus;
}>;

export function SubmissionHeader({ number, status, title, type }: SubmissionHeaderProps) {
  const t = useTranslations("MySubmission");
  const tType = useTranslations("Submission.type");

  return (
    <section aria-labelledby="submission-title" className="on-dark bg-hero py-8 text-hero-foreground">
      <Container className="flex flex-col gap-2">
        <p className="text-sm font-bold tracking-wide uppercase opacity-90">
          {tType(type)} · {t("number", { number })}
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl" id="submission-title">
          {title}
        </h1>
        <div className="rounded-full bg-surface p-0.5 self-start">
          <StatusBadge status={status} />
        </div>
      </Container>
    </section>
  );
}
