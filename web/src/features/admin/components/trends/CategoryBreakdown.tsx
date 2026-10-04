import { useTranslations } from "next-intl";

import { submissionTypes } from "@/shared/submissions/submissionModel";

import type { TrendsDto } from "../../schemas/adminDtoSchemas";

type CategoryBreakdownProps = Readonly<{
  category: TrendsDto["byCategory"][number];
}>;

/** Tooltip content: one category's submissions by type. */
export function CategoryBreakdown({ category }: CategoryBreakdownProps) {
  const tType = useTranslations("Submission.type");

  return (
    <span className="flex flex-col gap-0.5">
      <span className="font-bold">{category.name}</span>
      {submissionTypes.map((type) => (
        <span className="flex justify-between gap-4" key={type}>
          <span>{tType(type)}</span>
          <span className="tabular-nums">{category.byType[type] ?? 0}</span>
        </span>
      ))}
    </span>
  );
}
