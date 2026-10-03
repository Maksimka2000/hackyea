"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import { TARGET_GROUP_MAX_LENGTH } from "../constants/submission-limits";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function TargetGroupInput() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("targetGroup");

  return (
    <FormField error={error} hint={t("targetGroup.hint")} id="submission-target-group" label={t("targetGroup.label")}>
      {(controlProps) => <Input maxLength={TARGET_GROUP_MAX_LENGTH} {...controlProps} {...register("targetGroup")} />}
    </FormField>
  );
}
