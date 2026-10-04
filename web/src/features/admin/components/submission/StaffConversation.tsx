"use client";

import { useTranslations } from "next-intl";

import { MessageThread } from "@/shared/submissions/MessageThread";
import { ReplyForm } from "@/shared/submissions/ReplyForm";
import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Card } from "@/shared/ui/primitives/Card";

import type { ActionState } from "../../hooks/useAdminSubmission";

type StaffConversationProps = Readonly<{
  submission: SubmissionDetail;
  onSend: (body: string) => Promise<boolean>;
  state: ActionState;
}>;

/** Reply to the submitter; the first reply marks the submission answered and is counted as the response time. */
export function StaffConversation({ onSend, state, submission }: StaffConversationProps) {
  const t = useTranslations("Admin.submission.conversation");
  const tAdmin = useTranslations("Admin");

  return (
    <Card className="flex flex-col gap-5 p-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
      <MessageThread messages={submission.messages} viewer="staff" />
      <ReplyForm
        error={state.error === "generic" ? tAdmin("actionError") : state.error}
        id="staff-reply"
        isSending={state.isPending}
        label={t("label")}
        onSend={onSend}
      />
    </Card>
  );
}
