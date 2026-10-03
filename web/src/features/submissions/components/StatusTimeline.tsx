import { Check } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/primitives/Card";

import { submissionStatuses } from "../constants/submission-statuses";
import type { SubmissionView } from "../types/submission-view";

type StatusTimelineProps = Readonly<{
  submission: SubmissionView;
}>;

export function StatusTimeline({ submission }: StatusTimelineProps) {
  const t = useTranslations("SubmissionStatus.timeline");
  const format = useFormatter();
  const currentIndex = submissionStatuses.indexOf(submission.status);

  const dateFor = (status: (typeof submissionStatuses)[number]) => {
    if (status === "received") {
      return submission.createdAt;
    }

    return status === "answered" ? submission.reply?.repliedAt : undefined;
  };

  return (
    <Card className="p-6">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
      <ol className="grid gap-4 sm:grid-cols-4">
        {submissionStatuses.map((status, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          const date = dateFor(status);

          return (
            <li aria-current={state === "current" ? "step" : undefined} className="flex gap-3 sm:flex-col" key={status}>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 flex-none place-items-center rounded-full border-2 font-extrabold",
                  state === "upcoming" ? "border-border-strong text-muted" : "border-primary bg-primary text-primary-foreground",
                )}
              >
                {state === "done" ? <Check className="size-5" /> : index + 1}
              </span>
              <div className="flex flex-col">
                <span className={cn("font-bold", state === "upcoming" ? "text-muted" : "text-foreground")}>
                  {t(`steps.${status}`)}
                  <span className="sr-only"> ({t(`state.${state}`)})</span>
                </span>
                {date ? (
                  <span className="text-sm text-muted">
                    {format.dateTime(date, { dateStyle: "medium", timeZone: "Europe/Warsaw" })}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
