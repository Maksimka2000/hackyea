import { useFormatter, useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";
import { Tag } from "@/shared/ui/primitives/Tag";

import type { SubmissionDetail } from "./submissionModel";

type SubmissionFactsProps = Readonly<{
  submission: SubmissionDetail;
}>;

/** What was submitted: the text and the type-specific fields. */
export function SubmissionFacts({ submission }: SubmissionFactsProps) {
  const t = useTranslations("Submission");
  const format = useFormatter();
  const facts: [string, string | null][] = [
    [t("facts.category"), submission.category?.name ?? null],
    [t("facts.place"), submission.place],
    [t("facts.targetGroup"), submission.targetGroup],
    [t("facts.stage"), submission.stage ? t(`stage.${submission.stage}`) : null],
    [t("facts.pilotScale"), submission.pilotScale],
    [t("facts.results"), submission.results],
  ];

  return (
    <Card className="flex flex-col gap-4 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{submission.title}</h2>
        <Tag>{t(`type.${submission.type}`)}</Tag>
      </div>
      {submission.descriptionParagraphs.map((paragraph, index) => (
        <p className="max-w-3xl text-lg text-foreground" key={index}>
          {paragraph}
        </p>
      ))}
      <dl className="grid gap-3 sm:grid-cols-2">
        {facts
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm font-bold text-muted">{label}</dt>
              <dd className="text-foreground">{value}</dd>
            </div>
          ))}
      </dl>
      <p className="text-sm text-muted">
        {t("facts.sentOn", { date: format.dateTime(submission.createdAt, { dateStyle: "long", timeZone: "Europe/Warsaw" }) })}
      </p>
    </Card>
  );
}
