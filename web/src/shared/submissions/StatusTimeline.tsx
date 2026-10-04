import { Check } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/primitives/Card";

import { timelineSteps, type SubmissionDetail } from "./submissionModel";

type StatusTimelineProps = Readonly<{
  submission: SubmissionDetail;
}>;

/** Sent → in review → answered → closed, with the date each step was reached. A rejection takes the last step's place. */
export function StatusTimeline({ submission }: StatusTimelineProps) {
  const t = useTranslations("Submission.timeline");
  const tStatus = useTranslations("Submission.status");
  const format = useFormatter();
  const rejected = submission.status === "rejected";
  const steps = timelineSteps.map((step) => (rejected && step === "closed" ? "rejected" : step));
  const currentIndex = rejected ? steps.length - 1 : steps.indexOf(submission.status);
  const reachedAt = (status: string) => [...submission.timeline].reverse().find((entry) => entry.status === status)?.at;

  return (
    <Card className="p-6">
      <h2 className="mb-5 text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
      <ol className="grid gap-4 sm:grid-cols-4">
        {steps.map((status, index) => {
          const state = index < currentIndex ? "done" : index === currentIndex ? "current" : "upcoming";
          const date = state === "upcoming" ? undefined : reachedAt(status);

          return (
            <li aria-current={state === "current" ? "step" : undefined} className="flex gap-3 sm:flex-col" key={status}>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 flex-none place-items-center rounded-full border-2 font-extrabold",
                  state === "upcoming" && "border-border-strong text-muted",
                  state !== "upcoming" && status === "rejected" && "border-danger bg-danger text-primary-foreground",
                  state !== "upcoming" && status !== "rejected" && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {state === "done" ? <Check className="size-5" /> : index + 1}
              </span>
              <div className="flex flex-col">
                <span className={cn("font-bold", state === "upcoming" ? "text-muted" : "text-foreground")}>
                  {tStatus(status)}
                  <span className="sr-only"> ({t(`state.${state}`)})</span>
                </span>
                {date ? (
                  <span className="text-sm text-muted">
                    {format.dateTime(date, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Warsaw" })}
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {submission.rejectionReason ? (
        <p className="mt-5 text-foreground">
          <span className="font-bold">{t("rejectionReason")}</span> {submission.rejectionReason}
        </p>
      ) : null}
    </Card>
  );
}
