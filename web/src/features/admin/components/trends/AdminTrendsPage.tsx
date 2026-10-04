"use client";

import { useFormatter, useTranslations } from "next-intl";

import { useFormatHours } from "../../hooks/useFormatHours";
import { useTrends } from "../../hooks/useTrends";
import { AdminPageHeader } from "../shell/AdminPageHeader";
import { QueryState } from "../shell/QueryState";
import { StatTile } from "../shell/StatTile";

import { CategoryBreakdown } from "./CategoryBreakdown";
import { ChartCard } from "./ChartCard";
import { HorizontalBars } from "./HorizontalBars";
import { TrendsFilters } from "./TrendsFilters";
import { TrendsTable } from "./TrendsTable";
import { UnmatchedQueries } from "./UnmatchedQueries";
import { WeeklyColumns } from "./WeeklyColumns";

/** Staff-only trend view: aggregated needs by area, over time and by kind of submitter. No personal data. */
export function AdminTrendsPage() {
  const t = useTranslations("Admin.trends");
  const tRole = useTranslations("Account.menu.roles");
  const format = useFormatter();
  const formatHours = useFormatHours();
  const { filter, query, setFilter } = useTrends();
  const data = query.data;
  const count = (value: number) => format.number(value);

  return (
    <>
      <AdminPageHeader lead={t("lead")} title={t("title")} />
      <div className="flex flex-col gap-6">
        <TrendsFilters filter={filter} onChange={setFilter} />
        <QueryState isError={query.isError} isPending={query.isPending} />
        {data ? (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatTile
                emphasis
                hint={t("kpi.categoriesHint")}
                label={t("kpi.categories")}
                value={t("kpi.categoriesValue", { covered: data.categoriesWithSubmissions, total: data.categoriesTotal })}
              />
              <StatTile hint={data.uncategorised > 0 ? t("kpi.uncategorised", { count: data.uncategorised }) : undefined} label={t("kpi.submissions")} value={count(data.submissionsTotal)} />
              <StatTile hint={t("kpi.answered", { count: data.responseTime.answeredCount })} label={t("kpi.responseTime")} value={formatHours(data.responseTime.averageHours)} />
              <StatTile label={t("kpi.waiting")} value={count(data.responseTime.waitingCount)} />
            </div>

            <ChartCard id="trend-categories" subtitle={t("categories.subtitle")} title={t("categories.title")}>
              <HorizontalBars
                data={data.byCategory.map((category) => ({
                  key: category.categoryId ?? "none",
                  label: category.name,
                  value: category.total,
                  detail: <CategoryBreakdown category={category} />,
                }))}
                label={t("categories.title")}
                valueLabel={count}
              />
              <TrendsTable categories={data.byCategory} />
            </ChartCard>

            <div className="grid gap-6 xl:grid-cols-2">
              <ChartCard id="trend-weekly" subtitle={t("weekly.subtitle")} title={t("weekly.title")}>
                <WeeklyColumns weeks={data.byWeek} />
              </ChartCard>
              <ChartCard id="trend-roles" title={t("roles.title")}>
                <HorizontalBars
                  data={data.bySubmitterRole.map((row) => ({ key: row.role, label: tRole(row.role as "Resident"), value: row.count }))}
                  label={t("roles.title")}
                  valueLabel={count}
                />
              </ChartCard>
            </div>

            <ChartCard id="trend-unmatched" subtitle={t("unmatched.subtitle")} title={t("unmatched.title")}>
              <UnmatchedQueries queries={data.topUnmatchedQueries} />
            </ChartCard>
          </>
        ) : null}
      </div>
    </>
  );
}
