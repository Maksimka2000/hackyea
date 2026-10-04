"use client";

import { useFormatter, useNow, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { StatusBadge } from "@/shared/submissions/StatusBadge";

import { useFormatHours } from "../../hooks/useFormatHours";
import type { InboxRow } from "../../schemas/adminDtoSchemas";

type InboxTableProps = Readonly<{
  rows: InboxRow[];
  caption: string;
}>;

/** Submissions as a table; unseen rows are marked with a "new" label (not colour only). */
export function InboxTable({ caption, rows }: InboxTableProps) {
  const t = useTranslations("Admin.inbox");
  const tType = useTranslations("Submission.type");
  const tRole = useTranslations("Account.menu.roles");
  const format = useFormatter();
  const now = useNow({ updateInterval: 60_000 });
  const formatHours = useFormatHours();

  if (rows.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <div className="border-line overflow-x-auto rounded-card border-border-strong">
      <table className="w-full min-w-[48rem] text-left">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-tint text-sm text-muted">
          <tr>
            <th className="px-4 py-3" scope="col">{t("columns.submission")}</th>
            <th className="px-4 py-3" scope="col">{t("columns.status")}</th>
            <th className="px-4 py-3" scope="col">{t("columns.author")}</th>
            <th className="px-4 py-3" scope="col">{t("columns.received")}</th>
            <th className="px-4 py-3" scope="col">{t("columns.response")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr className={cn("border-line border-x-0 border-b-0 border-border", !row.seen && "bg-tint")} key={row.id}>
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                  {!row.seen ? <span className="rounded-full bg-accent px-2 text-xs font-extrabold text-accent-foreground">{t("new")}</span> : null}
                  <span>{row.number}</span>
                  <span>· {tType(row.type)}</span>
                  {row.category ? <span>· {row.category.name}</span> : null}
                </div>
                <Link className="font-bold text-primary underline" href={`/admin/submissions/${row.id}`}>
                  {row.title}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={row.status} />
              </td>
              <td className="px-4 py-3 text-sm">
                <span className="block font-semibold text-foreground">{row.authorName}</span>
                <span className="text-muted">{tRole(row.authorRole as "Resident")}</span>
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {format.dateTime(new Date(row.createdAt), { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Warsaw" })}
              </td>
              <td className="px-4 py-3 text-sm text-foreground">
                {row.responseHours !== null ? formatHours(row.responseHours) : <span className="text-muted">{t("waiting", { time: format.relativeTime(new Date(row.createdAt), now) })}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
