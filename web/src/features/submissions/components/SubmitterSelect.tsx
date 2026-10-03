"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Select } from "@/shared/ui/primitives/Select";

import { submitterTypes } from "../constants/submitter-types";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function SubmitterSelect() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();

  return (
    <FormField id="submission-submitter" label={t("submitter.label")}>
      {(controlProps) => (
        <Select {...controlProps} {...register("submitterType")}>
          <option value="">{t("submitter.empty")}</option>
          {submitterTypes.map((type) => (
            <option key={type} value={type}>
              {t(`submitter.options.${type}`)}
            </option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
