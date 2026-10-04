"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";
import { Tag } from "@/shared/ui/primitives/Tag";

import { useMyFeedback } from "../hooks/useMyFeedback";

export function MyFeedbackList() {
  const t = useTranslations("MyFeedback");
  const format = useFormatter();
  const { data, isError, isPending } = useMyFeedback();

  if (isPending) {
    return <Skeleton className="h-40" />;
  }

  if (isError) {
    return <p className="text-danger" role="alert">{t("loadError")}</p>;
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-lg text-muted">{t("empty")}</p>
        <Link className="font-semibold text-primary underline" href="/library">{t("toLibrary")}</Link>
      </Card>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.map((item) => (
        <li key={item.id}>
          <Card className="flex flex-col gap-3 p-5">
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <Tag>{t(`kind.${item.kind}`)}</Tag>
              <span className="font-bold text-foreground">{t(`status.${item.status}`)}</span>
              <span className="text-muted">{format.dateTime(item.createdAt, { dateStyle: "medium", timeZone: "Europe/Warsaw" })}</span>
            </div>
            <Link className="font-bold text-primary underline" href={`/library/${item.innovationId}`}>{item.innovationTitle}</Link>
            <p className="whitespace-pre-line text-foreground">{item.body}</p>
            {item.staffNote ? (
              <p className="border-line rounded-control border-primary bg-tint p-3 text-foreground">
                <span className="font-bold">{t("staffNote")}</span> {item.staffNote}
              </p>
            ) : null}
          </Card>
        </li>
      ))}
    </ul>
  );
}
