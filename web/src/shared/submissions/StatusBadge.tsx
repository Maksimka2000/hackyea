import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

import type { SubmissionStatus } from "./submissionModel";

type StatusBadgeProps = Readonly<{
  status: SubmissionStatus;
}>;

const statusClasses: Record<SubmissionStatus, string> = {
  received: "border-border-strong bg-tint text-foreground",
  inReview: "border-primary bg-tint text-primary",
  answered: "border-primary bg-primary text-primary-foreground",
  closed: "border-border-strong bg-surface text-muted",
  rejected: "border-danger bg-surface text-danger",
};

/** The status as text (never colour alone). */
export function StatusBadge({ status }: StatusBadgeProps) {
  const t = useTranslations("Submission.status");

  return (
    <span className={cn("border-line inline-flex w-fit rounded-full px-3 py-0.5 text-sm font-bold", statusClasses[status])}>
      {t(status)}
    </span>
  );
}
