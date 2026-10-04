import { useFormatter, useTranslations } from "next-intl";

import type { TrendsDto } from "../../schemas/adminDtoSchemas";

type UnmatchedQueriesProps = Readonly<{
  queries: TrendsDto["topUnmatchedQueries"];
}>;

/** What people searched for and found nothing: candidates for new cards or calls. */
export function UnmatchedQueries({ queries }: UnmatchedQueriesProps) {
  const t = useTranslations("Admin.trends.unmatched");
  const format = useFormatter();

  if (queries.length === 0) {
    return <p className="text-muted">{t("empty")}</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <caption className="sr-only">{t("title")}</caption>
      <thead className="text-muted">
        <tr>
          <th className="py-2 pr-3" scope="col">{t("text")}</th>
          <th className="py-2 pr-3 text-right" scope="col">{t("count")}</th>
          <th className="py-2 text-right" scope="col">{t("last")}</th>
        </tr>
      </thead>
      <tbody>
        {queries.map((query) => (
          <tr className="border-line border-x-0 border-b-0 border-border" key={query.text}>
            <td className="py-2 pr-3 text-foreground">{query.text}</td>
            <td className="py-2 pr-3 text-right font-bold text-foreground tabular-nums">{query.count}</td>
            <td className="py-2 text-right text-muted">{format.dateTime(new Date(query.lastAskedAt), { dateStyle: "short" })}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
