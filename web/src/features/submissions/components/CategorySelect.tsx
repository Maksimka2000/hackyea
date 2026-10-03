"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { libraryCategories } from "@/shared/constants/library-categories";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Select } from "@/shared/ui/primitives/Select";

import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function CategorySelect() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();

  return (
    <FormField id="submission-category" label={t("category.label")}>
      {(controlProps) => (
        <Select {...controlProps} {...register("categoryId")}>
          <option value="">{t("category.empty")}</option>
          {libraryCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
