"use client";

import { MessagesSquare } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { StatusBadge } from "@/shared/submissions/StatusBadge";
import { Card } from "@/shared/ui/primitives/Card";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";

import { useMySubmissions } from "../hooks/useMySubmissions";

export function MySubmissionList() {
  const t = useTranslations("MySubmissions");
  const tType = useTranslations("Submission.type");
  const format = useFormatter();
  const { data, isError, isPending } = useMySubmissions();

  if (isPending) {
    return <Skeleton className="h-48" />;
  }

  if (isError) {
    return (
      <p className="text-danger" role="alert">
        {t("loadError")}
      </p>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-lg text-muted">{t("empty")}</p>
      </Card>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {data.map((item) => (
        <li key={item.id}>
          <Card className="flex flex-col gap-2 p-5 hover:border-primary">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={item.status} />
              <span className="text-sm font-bold text-muted">{tType(item.type)}</span>
              <span className="text-sm text-muted">{item.number}</span>
            </div>
            <Link className="text-lg font-bold text-primary underline" href={`/my-submissions/${item.id}`}>
              {item.title}
            </Link>
            <p className="flex flex-wrap items-center gap-x-4 text-sm text-muted">
              <span>{t("sentOn", { date: format.dateTime(item.createdAt, { dateStyle: "medium", timeZone: "Europe/Warsaw" }) })}</span>
              {item.categoryName ? <span>{item.categoryName}</span> : null}
              <span className="inline-flex items-center gap-1">
                <MessagesSquare aria-hidden="true" className="size-4" />
                {t("messages", { count: item.messageCount })}
              </span>
            </p>
          </Card>
        </li>
      ))}
    </ul>
  );
}
