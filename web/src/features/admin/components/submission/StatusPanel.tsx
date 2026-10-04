"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";

import type { ActionState } from "../../hooks/useAdminSubmission";

import { ActionError } from "./ActionError";

const choices = ["inReview", "answered", "closed"] as const;

type StatusPanelProps = Readonly<{
  submission: SubmissionDetail;
  onChange: (value: { status: string; note: string }) => Promise<boolean>;
  state: ActionState;
}>;

/** Moves the submission along; the submitter is notified. Rejecting is done under moderation, with a reason. */
export function StatusPanel({ onChange, state, submission }: StatusPanelProps) {
  const t = useTranslations("Admin.submission.status");
  const tStatus = useTranslations("Submission.status");
  const [status, setStatus] = useState<string>(choices.find((choice) => choice === submission.status) ?? "inReview");
  const [note, setNote] = useState("");

  return (
    <Card className="flex flex-col gap-3 p-5">
      <h2 className="text-lg font-bold text-foreground">{t("title")}</h2>
      <label className="text-sm font-bold text-foreground" htmlFor="status-select">{t("label")}</label>
      <Select id="status-select" onChange={(event) => setStatus(event.target.value)} value={status}>
        {choices.map((choice) => (
          <option key={choice} value={choice}>{tStatus(choice)}</option>
        ))}
      </Select>
      <label className="text-sm font-bold text-foreground" htmlFor="status-note">{t("note")}</label>
      <Input id="status-note" maxLength={1000} onChange={(event) => setNote(event.target.value)} value={note} />
      <Button
        className="self-start"
        disabled={state.isPending || status === submission.status}
        onClick={async () => {
          if (await onChange({ status, note })) setNote("");
        }}
      >
        {t("save")}
      </Button>
      <ActionError error={state.error} />
    </Card>
  );
}
