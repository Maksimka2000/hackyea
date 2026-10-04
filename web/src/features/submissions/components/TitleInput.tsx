"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import { TITLE_MAX_LENGTH } from "../constants/submission-limits";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

type TitleInputProps = Readonly<{
  optional?: boolean;
}>;

export function TitleInput({ optional = false }: TitleInputProps) {
  const t = useTranslations("Submit.fields");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("title");

  return (
    <FormField
      error={error}
      hint={optional ? t("title.optionalHint") : undefined}
      id="submission-title"
      label={optional ? t("title.optionalLabel") : t("title.label")}
    >
      {(controlProps) => <Input maxLength={TITLE_MAX_LENGTH} {...controlProps} {...register("title")} />}
    </FormField>
  );
}
