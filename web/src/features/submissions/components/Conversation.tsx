"use client";

import { useTranslations } from "next-intl";

import { MessageThread } from "@/shared/submissions/MessageThread";
import { ReplyForm } from "@/shared/submissions/ReplyForm";
import type { SubmissionDetail } from "@/shared/submissions/submissionModel";
import { Card } from "@/shared/ui/primitives/Card";

type ConversationProps = Readonly<{
  submission: SubmissionDetail;
  sendReply: (body: string) => Promise<boolean>;
  isSending: boolean;
  replyError?: string;
}>;

/** Talking to ROPS about this submission. Closed or rejected submissions can be read but not answered. */
export function Conversation({ isSending, replyError, sendReply, submission }: ConversationProps) {
  const t = useTranslations("MySubmission.conversation");
  const isFinished = submission.status === "closed" || submission.status === "rejected";

  return (
    <Card className="flex flex-col gap-5 p-6">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
      <MessageThread messages={submission.messages} viewer="submitter" />
      {isFinished ? (
        <p className="text-muted">{t("closed")}</p>
      ) : (
        <ReplyForm
          error={replyError === "generic" ? t("sendError") : replyError}
          id="submission-reply"
          isSending={isSending}
          label={t("label")}
          onSend={sendReply}
        />
      )}
    </Card>
  );
}
