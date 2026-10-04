"use client";

import { useTranslations } from "next-intl";

import { submissionTypes } from "@/shared/submissions/submissionModel";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";

import type { TrendsFilter } from "../../hooks/useTrends";

type TrendsFiltersProps = Readonly<{
  filter: TrendsFilter;
  onChange: (filter: TrendsFilter) => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

/** One row above all charts: the date window and the submission type apply to every chart below. */
export function TrendsFilters({ filter, onChange }: TrendsFiltersProps) {
  const t = useTranslations("Admin.trends.filters");
  const tType = useTranslations("Submission.type");

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="trends-from">{t("from")}</label>
        <Input id="trends-from" onChange={(event) => onChange({ ...filter, from: event.target.value || undefined })} type="date" value={filter.from ?? ""} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="trends-to">{t("to")}</label>
        <Input id="trends-to" onChange={(event) => onChange({ ...filter, to: event.target.value || undefined })} type="date" value={filter.to ?? ""} />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="trends-type">{t("type")}</label>
        <Select id="trends-type" onChange={(event) => onChange({ ...filter, type: event.target.value || undefined })} value={filter.type ?? ""}>
          <option value="">{t("allTypes")}</option>
          {submissionTypes.map((type) => (
            <option key={type} value={type}>{tType(type)}</option>
          ))}
        </Select>
      </div>
    </div>
  );
}
