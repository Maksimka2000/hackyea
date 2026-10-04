import { MessagesSquare } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { cn } from "@/shared/lib/cn";

import type { SubmissionMessage } from "./submissionModel";

type MessageThreadProps = Readonly<{
  messages: SubmissionMessage[];
  /** Whose view this is: messages from the other side are labelled as such. */
  viewer: "submitter" | "staff";
}>;

/** The conversation between the submitter and ROPS staff, oldest first. */
export function MessageThread({ messages, viewer }: MessageThreadProps) {
  const t = useTranslations("Submission.thread");
  const format = useFormatter();

  if (messages.length === 0) {
    return (
      <p className="flex items-center gap-3 text-muted">
        <MessagesSquare aria-hidden="true" className="size-6 flex-none text-primary" />
        {t(viewer === "staff" ? "emptyStaff" : "empty")}
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-4">
      {messages.map((message) => {
        const own = (viewer === "staff") === message.fromStaff;
        return (
          <li className={cn("flex", own ? "justify-end" : "justify-start")} key={message.id}>
            <article
              className={cn(
                "border-line flex max-w-2xl flex-col gap-2 rounded-card p-4",
                message.fromStaff ? "border-primary bg-tint" : "border-border-strong bg-surface",
              )}
            >
              <header className="flex flex-wrap items-baseline gap-x-2 text-sm">
                <span className="font-bold text-foreground">{message.authorName}</span>
                <span className="text-muted">{message.fromStaff ? t("staff") : t("submitter")}</span>
                <time className="text-muted" dateTime={message.createdAt.toISOString()}>
                  {format.dateTime(message.createdAt, { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Warsaw" })}
                </time>
              </header>
              {message.paragraphs.map((paragraph, index) => (
                <p className="text-foreground" key={index}>
                  {paragraph}
                </p>
              ))}
            </article>
          </li>
        );
      })}
    </ol>
  );
}
