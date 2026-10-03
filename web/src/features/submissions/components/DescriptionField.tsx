"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { FormField } from "@/shared/ui/primitives/FormField";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { DESCRIPTION_MAX_LENGTH } from "../constants/submission-limits";
import type { SubmissionType } from "../constants/submission-types";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

type DescriptionFieldProps = Readonly<{
  type: SubmissionType;
}>;

export function DescriptionField({ type }: DescriptionFieldProps) {
  const t = useTranslations("Submit.fields");
  const { control, register } = useFormContext<SubmissionFormValues>();
  const length = useWatch({ control, name: "description" }).length;
  const error = useSubmissionFieldError("description");

  return (
    <div className="flex flex-col gap-1">
      <FormField error={error} hint={t("descriptionHint")} id="submission-description" label={t(`description.${type}`)}>
        {(controlProps) => (
          <Textarea
            className="min-h-44"
            maxLength={DESCRIPTION_MAX_LENGTH}
            {...controlProps}
            {...register("description")}
          />
        )}
      </FormField>
      <p className="text-right text-sm text-muted">{t("counter", { count: length, max: DESCRIPTION_MAX_LENGTH })}</p>
    </div>
  );
}
