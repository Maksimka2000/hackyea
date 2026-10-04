"use client";

import { useState } from "react";
import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Input } from "@/shared/ui/primitives/Input";
import { Tag } from "@/shared/ui/primitives/Tag";

import type { FeedbackItem, FeedbackStatus } from "../../schemas/adminDtoSchemas";

type FeedbackCardProps = Readonly<{
  item: FeedbackItem;
  isReviewing: boolean;
  onReview: (id: string, status: Exclude<FeedbackStatus, "new">, note: string) => void;
}>;

export function FeedbackCard({ isReviewing, item, onReview }: FeedbackCardProps) {
  const t = useTranslations("Admin.feedback");
  const format = useFormatter();
  const [note, setNote] = useState(item.staffNote ?? "");
  const noteId = `feedback-note-${item.id}`;

  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Tag>{t(`kind.${item.kind}`)}</Tag>
        <span className="font-bold text-foreground">{t(`status.${item.status}`)}</span>
        <span className="text-muted">
          {item.authorName ?? "—"} · {format.dateTime(new Date(item.createdAt), { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Warsaw" })}
        </span>
      </div>
      <Link className="font-bold text-primary underline" href={`/library/${item.innovationId}`}>
        {item.innovationTitle}
      </Link>
      <p className="whitespace-pre-line text-foreground">{item.body}</p>
      {item.reviewedAt ? (
        <p className="text-sm text-muted">
          {t("reviewedOn", { date: format.dateTime(new Date(item.reviewedAt), { dateStyle: "medium", timeZone: "Europe/Warsaw" }) })}
        </p>
      ) : null}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex min-w-64 flex-1 flex-col gap-1">
          <label className="text-sm font-bold text-foreground" htmlFor={noteId}>{t("note")}</label>
          <Input id={noteId} maxLength={1000} onChange={(event) => setNote(event.target.value)} value={note} />
        </div>
        <Button disabled={isReviewing} onClick={() => onReview(item.id, "accepted", note)}>{t("accept")}</Button>
        <Button disabled={isReviewing} onClick={() => onReview(item.id, "rejected", note)} variant="outline">{t("reject")}</Button>
      </div>
    </Card>
  );
}
