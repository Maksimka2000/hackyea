"use client";

import { useTranslations } from "next-intl";
import { useFormContext } from "react-hook-form";

import { ideaStages } from "../constants/idea-stages";
import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

const ERROR_ID = "submission-stage-error";

export function StageField() {
  const t = useTranslations("Submit.fields.stage");
  const { register } = useFormContext<SubmissionFormValues>();
  const error = useSubmissionFieldError("stage");

  return (
    <fieldset aria-describedby={error ? ERROR_ID : undefined} className="flex flex-col gap-3">
      <legend className="mb-1 text-base font-bold text-foreground">{t("legend")}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {ideaStages.map((stage) => (
          <label
            className="border-line flex cursor-pointer items-center gap-3 rounded-control border-border bg-tint p-4 has-checked:border-primary has-checked:bg-surface has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus"
            key={stage}
          >
            <input className="size-5 accent-primary" type="radio" value={stage} {...register("stage")} />
            <span className="font-semibold text-foreground">{t(`options.${stage}`)}</span>
          </label>
        ))}
      </div>
      {error ? (
        <p className="font-semibold text-danger" id={ERROR_ID} role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}
