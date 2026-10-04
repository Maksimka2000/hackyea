"use client";

import { useFormatter, useTranslations } from "next-intl";

import type { TrendsDto } from "../../schemas/adminDtoSchemas";

type WeeklyColumnsProps = Readonly<{
  weeks: TrendsDto["byWeek"];
}>;

/** Submissions per week as columns on one baseline; the hovered or focused week shows its date and count. */
export function WeeklyColumns({ weeks }: WeeklyColumnsProps) {
  const t = useTranslations("Admin.trends.weekly");
  const format = useFormatter();
  const max = Math.max(1, ...weeks.map((week) => week.total));

  if (weeks.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <div>
      <ol aria-label={t("label")} className="flex h-48 items-end gap-0.5 border-b border-border">
        {weeks.map((week) => {
          const date = format.dateTime(new Date(week.weekStart), { day: "numeric", month: "short" });
          return (
            <li className="group relative flex h-full max-w-6 flex-1 flex-col justify-end" key={week.weekStart} tabIndex={0}>
              <span aria-hidden="true" className="rounded-t-sm bg-primary" style={{ height: `${(week.total / max) * 100}%` }} />
              <span className="sr-only">{t("item", { date, count: week.total })}</span>
              <span className="border-line pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 hidden -translate-x-1/2 rounded-control border-border-strong bg-surface px-2 py-1 text-sm whitespace-nowrap text-foreground shadow-card group-hover:block group-focus:block">
                {t("item", { date, count: week.total })}
              </span>
            </li>
          );
        })}
      </ol>
      <div aria-hidden="true" className="mt-1 flex justify-between text-xs text-muted">
        <span>{format.dateTime(new Date(weeks[0].weekStart), { day: "numeric", month: "short" })}</span>
        <span>{format.dateTime(new Date(weeks[weeks.length - 1].weekStart), { day: "numeric", month: "short" })}</span>
      </div>
    </div>
  );
}
