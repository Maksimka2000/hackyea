"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import type { ActionState } from "../../hooks/useAdminSubmission";

import { ActionError } from "./ActionError";
import { ModerationForm } from "./ModerationForm";

type ModerationPanelProps = Readonly<{
  submission: SubmissionDetail;
  onModerate: (body: Record<string, string | null>) => Promise<boolean>;
  state: ActionState;
}>;

/** Tidy the submitter's text (e.g. remove personal data) or reject the submission with a reason the submitter will see. */
export function ModerationPanel({ onModerate, state, submission }: ModerationPanelProps) {
  const t = useTranslations("Admin.submission.moderation");
  const [mode, setMode] = useState<"idle" | "edit" | "reject">("idle");
  const [reason, setReason] = useState("");
  const finished = submission.status === "closed" || submission.status === "rejected";

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      {mode === "idle" ? (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setMode("edit")} variant="outline">{t("edit")}</Button>
          {!finished ? <Button onClick={() => setMode("reject")} variant="outline">{t("reject")}</Button> : null}
        </div>
      ) : null}
      {mode === "edit" ? (
        <ModerationForm
          isPending={state.isPending}
          onCancel={() => setMode("idle")}
          onSave={async (body) => {
            if (await onModerate(body)) setMode("idle");
          }}
          submission={submission}
        />
      ) : null}
      {mode === "reject" ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            if (reason.trim() && (await onModerate({ rejectReason: reason.trim() }))) setMode("idle");
          }}
        >
          <label className="text-sm font-bold text-foreground" htmlFor="reject-reason">{t("reason")}</label>
          <Textarea className="min-h-24" id="reject-reason" maxLength={1000} onChange={(event) => setReason(event.target.value)} required value={reason} />
          <div className="flex gap-2">
            <Button disabled={state.isPending || !reason.trim()} type="submit">{t("confirmReject")}</Button>
            <Button onClick={() => setMode("idle")} variant="outline">{t("cancel")}</Button>
          </div>
        </form>
      ) : null}
      <ActionError error={state.error} />
    </Card>
  );
}
