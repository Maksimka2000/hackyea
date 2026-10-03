import { useTranslations } from "next-intl";

import { Checkbox } from "@/shared/ui/primitives/Checkbox";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import type { LibraryFilter } from "../types/library-filter";

type LibraryFiltersProps = Readonly<{
  filter: LibraryFilter;
  onChange: (changes: Partial<LibraryFilter>) => void;
}>;

type ToggleProps = Readonly<{
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}>;

function Toggle({ checked, label, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 font-semibold text-foreground">
      <Checkbox checked={checked} className="mt-0" onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

export function LibraryFilters({ filter, onChange }: LibraryFiltersProps) {
  const t = useTranslations("Library.filters");

  return (
    <form className="border-line flex flex-col gap-4 rounded-card border-border-strong bg-surface p-5" onSubmit={(event) => event.preventDefault()}>
      <FormField id="library-query" label={t("queryLabel")}>
        {(controlProps) => (
          <Input
            {...controlProps}
            autoComplete="off"
            onChange={(event) => onChange({ query: event.target.value })}
            placeholder={t("queryPlaceholder")}
            type="search"
            value={filter.query}
          />
        )}
      </FormField>
      <fieldset className="flex flex-wrap gap-x-6 gap-y-3">
        <legend className="sr-only">{t("togglesLegend")}</legend>
        <Toggle checked={filter.onlyBadge} label={t("onlyBadge")} onChange={(onlyBadge) => onChange({ onlyBadge })} />
        <Toggle checked={filter.onlyVideo} label={t("onlyVideo")} onChange={(onlyVideo) => onChange({ onlyVideo })} />
        <Toggle checked={filter.onlyEvidence} label={t("onlyEvidence")} onChange={(onlyEvidence) => onChange({ onlyEvidence })} />
      </fieldset>
    </form>
  );
}
