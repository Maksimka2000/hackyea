import { Clock, MessageSquareText } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

import type { SubmissionView } from "../types/submission-view";

type StaffReplyProps = Readonly<{
  reply: SubmissionView["reply"];
}>;

export function StaffReply({ reply }: StaffReplyProps) {
  const t = useTranslations("SubmissionStatus.reply");
  const format = useFormatter();

  if (!reply) {
    return (
      <Card className="flex gap-4 bg-tint p-6">
        <Clock aria-hidden="true" className="size-7 flex-none text-primary" />
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-extrabold text-foreground">{t("title")}</h2>
          <p className="text-muted">{t("none")}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex gap-4 border-primary p-6">
      <MessageSquareText aria-hidden="true" className="size-7 flex-none text-primary" />
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{t("title")}</h2>
          <p className="text-sm text-muted">
            {t("repliedOn", { date: format.dateTime(reply.repliedAt, { dateStyle: "long", timeZone: "Europe/Warsaw" }) })}
          </p>
        </div>
        {reply.paragraphs.map((paragraph, index) => (
          <p className="max-w-3xl text-lg text-foreground" key={index}>
            {paragraph}
          </p>
        ))}
      </div>
    </Card>
  );
}
