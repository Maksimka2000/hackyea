import { useTranslations } from "next-intl";

import { submissionStatuses, submissionTypes } from "@/shared/submissions/submissionModel";

import type { TrendsDto } from "../../schemas/adminDtoSchemas";

type TrendsTableProps = Readonly<{
  categories: TrendsDto["byCategory"];
}>;

/** The same numbers as the category chart, as a table: every type and status per category. */
export function TrendsTable({ categories }: TrendsTableProps) {
  const t = useTranslations("Admin.trends");
  const tType = useTranslations("Submission.type");
  const tStatus = useTranslations("Submission.status");

  return (
    <details className="text-foreground">
      <summary className="cursor-pointer font-semibold text-primary">{t("table.show")}</summary>
      <div className="border-line mt-3 overflow-x-auto rounded-card border-border-strong">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <caption className="sr-only">{t("table.caption")}</caption>
          <thead className="bg-tint text-muted">
            <tr>
              <th className="px-3 py-2" scope="col">{t("table.category")}</th>
              <th className="px-3 py-2 text-right" scope="col">{t("table.total")}</th>
              {submissionTypes.map((type) => (
                <th className="px-3 py-2 text-right" key={type} scope="col">{tType(type)}</th>
              ))}
              {submissionStatuses.map((status) => (
                <th className="px-3 py-2 text-right" key={status} scope="col">{tStatus(status)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr className="border-line border-x-0 border-b-0 border-border" key={category.categoryId ?? "none"}>
                <th className="px-3 py-2 font-semibold" scope="row">{category.name}</th>
                <td className="px-3 py-2 text-right tabular-nums">{category.total}</td>
                {submissionTypes.map((type) => (
                  <td className="px-3 py-2 text-right tabular-nums" key={type}>{category.byType[type] ?? 0}</td>
                ))}
                {submissionStatuses.map((status) => (
                  <td className="px-3 py-2 text-right tabular-nums" key={status}>{category.byStatus[status] ?? 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}
