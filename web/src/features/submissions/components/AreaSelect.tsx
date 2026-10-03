"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { challengeAreas } from "@/shared/constants/challenge-areas";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Select } from "@/shared/ui/primitives/Select";

import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

export function AreaSelect() {
  const t = useTranslations("Submit.fields");
  const tAreas = useTranslations("ChallengeAreas");
  const { register } = useFormContext<SubmissionFormValues>();

  return (
    <FormField id="submission-area" label={t("area.label")}>
      {(controlProps) => (
        <Select {...controlProps} {...register("areaId")}>
          <option value="">{t("area.empty")}</option>
          {challengeAreas.map((area) => (
            <option key={area.key} value={area.slug}>
              {tAreas(`${area.key}.name`)}
            </option>
          ))}
        </Select>
      )}
    </FormField>
  );
}
