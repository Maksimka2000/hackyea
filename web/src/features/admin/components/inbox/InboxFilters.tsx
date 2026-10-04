"use client";

import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { submissionStatuses, submissionTypes, type SubmissionStatus, type SubmissionType } from "@/shared/submissions/submissionModel";
import { Checkbox } from "@/shared/ui/primitives/Checkbox";
import { Input } from "@/shared/ui/primitives/Input";
import { Select } from "@/shared/ui/primitives/Select";

import type { InboxFilter } from "../../types/inbox-filter";

type InboxFiltersProps = Readonly<{
  filter: InboxFilter;
  onChange: (change: Partial<Omit<InboxFilter, "page" | "pageSize">>) => void;
}>;

const labelClasses = "text-sm font-bold text-foreground";

export function InboxFilters({ filter, onChange }: InboxFiltersProps) {
  const t = useTranslations("Admin.inbox.filters");
  const tStatus = useTranslations("Submission.status");
  const tType = useTranslations("Submission.type");

  return (
    <form className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5 xl:items-end" onSubmit={(event) => event.preventDefault()} role="search">
      <div className="flex flex-col gap-1 xl:col-span-2">
        <label className={labelClasses} htmlFor="inbox-q">{t("q")}</label>
        <Input defaultValue={filter.q} id="inbox-q" onChange={(event) => onChange({ q: event.target.value.trim() || undefined })} type="search" />
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="inbox-status">{t("status")}</label>
        <Select id="inbox-status" onChange={(event) => onChange({ status: (event.target.value || undefined) as SubmissionStatus | undefined })} value={filter.status ?? ""}>
          <option value="">{t("all")}</option>
          {submissionStatuses.map((status) => (
            <option key={status} value={status}>{tStatus(status)}</option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="inbox-type">{t("type")}</label>
        <Select id="inbox-type" onChange={(event) => onChange({ type: (event.target.value || undefined) as SubmissionType | undefined })} value={filter.type ?? ""}>
          <option value="">{t("all")}</option>
          {submissionTypes.map((type) => (
            <option key={type} value={type}>{tType(type)}</option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <label className={labelClasses} htmlFor="inbox-category">{t("category")}</label>
        <Select id="inbox-category" onChange={(event) => onChange({ categoryId: event.target.value || undefined })} value={filter.categoryId ?? ""}>
          <option value="">{t("all")}</option>
          {libraryCategories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      </div>
      <label className="flex items-center gap-3 sm:col-span-2 xl:col-span-5">
        <Checkbox checked={filter.unseen} onChange={(event) => onChange({ unseen: event.target.checked })} />
        <span className="font-semibold text-foreground">{t("unseen")}</span>
      </label>
    </form>
  );
}
