"use client";

import { useTranslations } from "next-intl";
import { useFormContext, useWatch } from "react-hook-form";

import { Checkbox } from "@/shared/ui/primitives/Checkbox";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Input } from "@/shared/ui/primitives/Input";

import { useSubmissionFieldError } from "../hooks/useSubmissionFieldError";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";

const CONSENT_ID = "submission-email-consent";
const CONSENT_ERROR_ID = "submission-email-consent-error";

export function ContactFields() {
  const t = useTranslations("Submit.fields");
  const { control, register } = useFormContext<SubmissionFormValues>();
  const hasEmail = useWatch({ control, name: "email" }).trim().length > 0;
  const emailError = useSubmissionFieldError("email");
  const consentError = useSubmissionFieldError("emailConsent");

  return (
    <div className="flex flex-col gap-4">
      <FormField error={emailError} hint={t("email.hint")} id="submission-email" label={t("email.label")}>
        {(controlProps) => <Input autoComplete="email" inputMode="email" type="email" {...controlProps} {...register("email")} />}
      </FormField>
      {hasEmail ? (
        <div className="flex flex-col gap-2">
          <label className="flex cursor-pointer items-start gap-3" htmlFor={CONSENT_ID}>
            <Checkbox
              aria-describedby={consentError ? CONSENT_ERROR_ID : undefined}
              aria-invalid={consentError ? true : undefined}
              id={CONSENT_ID}
              {...register("emailConsent")}
            />
            <span className="text-foreground">{t("email.consent")}</span>
          </label>
          {consentError ? (
            <p className="font-semibold text-danger" id={CONSENT_ERROR_ID} role="alert">
              {consentError}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
