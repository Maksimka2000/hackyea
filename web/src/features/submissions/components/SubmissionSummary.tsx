import { useFormatter, useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";
import { Tag } from "@/shared/ui/primitives/Tag";

import type { SubmissionView } from "../types/submission-view";

type SubmissionSummaryProps = Readonly<{
  submission: SubmissionView;
}>;

export function SubmissionSummary({ submission }: SubmissionSummaryProps) {
  const t = useTranslations("SubmissionStatus");
  const format = useFormatter();

  return (
    <Card className="flex flex-col gap-3 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t("summary.title")}</h2>
        <Tag>{t(`type.${submission.type}`)}</Tag>
      </div>
      {submission.title ? <p className="text-xl font-bold text-foreground">{submission.title}</p> : null}
      {submission.descriptionParagraphs.map((paragraph, index) => (
        <p className="max-w-3xl text-lg text-foreground" key={index}>
          {paragraph}
        </p>
      ))}
      <p className="text-sm text-muted">
        {t("summary.sentOn", { date: format.dateTime(submission.createdAt, { dateStyle: "long", timeZone: "Europe/Warsaw" }) })}
      </p>
    </Card>
  );
}
