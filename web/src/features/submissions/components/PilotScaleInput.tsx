"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import { PILOT_SCALE_MAX_LENGTH } from "../constants/submission-limits";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function PilotScaleInput() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("pilotScale");

  return (
    <FormField error={error} hint={t("pilotScale.hint")} id="submission-pilot-scale" label={t("pilotScale.label")}>
      {(controlProps) => <Input maxLength={PILOT_SCALE_MAX_LENGTH} {...controlProps} {...register("pilotScale")} />}
    </FormField>
  );
}
