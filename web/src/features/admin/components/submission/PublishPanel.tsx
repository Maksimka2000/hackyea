"use client";

import { BookPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";

import type { ActionState } from "../../hooks/useAdminSubmission";

import { ActionError } from "./ActionError";

type PublishPanelProps = Readonly<{
  submission: SubmissionDetail;
  onPublish: () => void;
  state: ActionState;
}>;

/** Turns a good idea or practice into a draft library card, to be edited, verified and published. */
export function PublishPanel({ onPublish, state, submission }: PublishPanelProps) {
  const t = useTranslations("Admin.submission.publish");

  if (submission.type !== "idea" && submission.type !== "goodPractice") {
    return null;
  }

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <p className="text-sm text-muted">{submission.category ? t("text") : t("needsCategory")}</p>
      <Button className="self-start" disabled={state.isPending || !submission.category} onClick={onPublish}>
        <BookPlus aria-hidden="true" className="size-5" />
        {t("cta")}
      </Button>
      <ActionError error={state.error} />
    </Card>
  );
}
