"use client";

import { useFormatter, useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Card } from "@/shared/ui/primitives/Card";

import type { RatedInnovation } from "../../schemas/adminDtoSchemas";
import { StatTile } from "../shell/StatTile";

type RatingsOverviewProps = Readonly<{
  items: RatedInnovation[];
}>;

/** The results of the tester: how many ratings came in, the overall average, and each rated card. */
export function RatingsOverview({ items }: RatingsOverviewProps) {
  const t = useTranslations("Admin.feedback.ratings");
  const format = useFormatter();
  const total = items.reduce((sum, item) => sum + item.ratingCount, 0);
  const average = total === 0 ? null : items.reduce((sum, item) => sum + item.average * item.ratingCount, 0) / total;

  return (
    <section aria-labelledby="ratings-title" className="mb-10 flex flex-col gap-4">
      <h2 className="text-2xl font-extrabold text-foreground" id="ratings-title">{t("title")}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label={t("total")} value={format.number(total)} />
        <StatTile label={t("average")} value={average === null ? "—" : format.number(average, { maximumFractionDigits: 1 })} />
        <StatTile label={t("cards")} value={format.number(items.length)} />
      </div>
      {items.length === 0 ? (
        <Card className="p-5">
          <p className="text-muted">{t("empty")}</p>
          <Link className="font-semibold text-primary underline" href="/library">{t("toLibrary")}</Link>
        </Card>
      ) : (
        <div className="border-line overflow-x-auto rounded-card border-border-strong">
          <table className="w-full min-w-[40rem] text-left">
            <caption className="sr-only">{t("caption")}</caption>
            <thead className="bg-tint text-sm text-muted">
              <tr>
                <th className="px-4 py-3" scope="col">{t("columns.card")}</th>
                <th className="px-4 py-3 text-right" scope="col">{t("columns.average")}</th>
                <th className="px-4 py-3 text-right" scope="col">{t("columns.count")}</th>
                <th className="px-4 py-3 text-right" scope="col">{t("columns.newFeedback")}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr className="border-line border-x-0 border-b-0 border-border" key={item.innovationId}>
                  <td className="px-4 py-3">
                    <Link className="font-bold text-primary underline" href={`/admin/knowledge/innovations/${item.innovationId}`}>{item.title}</Link>
                  </td>
                  <td className="px-4 py-3 text-right font-bold text-foreground tabular-nums">{format.number(item.average, { maximumFractionDigits: 1 })}</td>
                  <td className="px-4 py-3 text-right text-foreground tabular-nums">{item.ratingCount}</td>
                  <td className="px-4 py-3 text-right text-foreground tabular-nums">{item.newFeedbackCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
