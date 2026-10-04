"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { RESULTS_MAX_LENGTH } from "../constants/submission-limits";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function ResultsField() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("results");

  return (
    <FormField error={error} hint={t("results.hint")} id="submission-results" label={t("results.label")}>
      {(controlProps) => <Textarea className="min-h-28" maxLength={RESULTS_MAX_LENGTH} {...controlProps} {...register("results")} />}
    </FormField>
  );
}
