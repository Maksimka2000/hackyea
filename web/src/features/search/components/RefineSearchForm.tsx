"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { useRefineSearchForm } from "../hooks/useRefineSearchForm";

const FIELD_ID = "refine-problem";
const COUNTER_ID = "refine-problem-counter";
const ERROR_ID = "refine-problem-error";

export function RefineSearchForm() {
  const t = useTranslations("Search.refine");
  const tValidation = useTranslations("Validation.problem");
  const { characterCount, errorKey, maxLength, minLength, onSubmit, problemField } = useRefineSearchForm();

  return (
    <form className="flex flex-col gap-3" noValidate onSubmit={onSubmit}>
      <label className="text-lg font-bold text-foreground" htmlFor={FIELD_ID}>
        {t("label")}
      </label>
      <Textarea
        aria-describedby={`${COUNTER_ID}${errorKey ? ` ${ERROR_ID}` : ""}`}
        aria-invalid={errorKey ? true : undefined}
        className="min-h-40"
        id={FIELD_ID}
        maxLength={maxLength}
        {...problemField}
      />
      <p className="text-right text-sm text-muted" id={COUNTER_ID}>
        {t("counter", { count: characterCount, max: maxLength })}
      </p>
      {errorKey ? (
        <p className="font-semibold text-danger" id={ERROR_ID} role="alert">
          {tValidation(errorKey, { min: minLength, max: maxLength })}
        </p>
      ) : null}
      <Button type="submit">
        <Search aria-hidden="true" className="size-5" />
        {t("submit")}
      </Button>
    </form>
  );
}
