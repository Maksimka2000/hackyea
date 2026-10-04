import { useFormatter, useTranslations } from "next-intl";

import { StatusBadge } from "@/shared/submissions/StatusBadge";
import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Card } from "@/shared/ui/primitives/Card";

import { useFormatHours } from "../../hooks/useFormatHours";

type SubmissionAdminHeaderProps = Readonly<{
  submission: SubmissionDetail;
}>;

export function SubmissionAdminHeader({ submission }: SubmissionAdminHeaderProps) {
  const t = useTranslations("Admin.submission");
  const tType = useTranslations("Submission.type");
  const tRole = useTranslations("Account.menu.roles");
  const format = useFormatter();
  const formatHours = useFormatHours();
  const author = submission.author;
  const responseHours = submission.firstResponseAt
    ? (submission.firstResponseAt.getTime() - submission.createdAt.getTime()) / 3_600_000
    : null;

  return (
    <Card className="flex flex-col gap-3 p-6">
      <p className="text-sm font-bold text-muted">
        {submission.number} · {tType(submission.type)}
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{submission.title}</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-foreground">
        <StatusBadge status={submission.status} />
        {author ? (
          <span>
            <span className="font-bold">{author.displayName}</span> · {tRole(author.role as "Resident")}
            {author.organizationName ? ` · ${author.organizationName}` : null}
          </span>
        ) : null}
        <span>{t("received", { date: format.dateTime(submission.createdAt, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Warsaw" }) })}</span>
        <span>{responseHours !== null ? t("respondedIn", { time: formatHours(responseHours) }) : t("noResponse")}</span>
      </div>
    </Card>
  );
}
