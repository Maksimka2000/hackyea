"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import { PLACE_MAX_LENGTH } from "../constants/submission-limits";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function PlaceInput() {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("place");

  return (
    <FormField error={error} hint={t("place.hint")} id="submission-place" label={t("place.label")}>
      {(controlProps) => <Input maxLength={PLACE_MAX_LENGTH} {...controlProps} {...register("place")} />}
    </FormField>
  );
}
