"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { useProblemForm } from "../hooks/useProblemForm";

import { ExamplePrompts } from "./ExamplePrompts";

const FIELD_ID = "problem";
const HINT_ID = "problem-hint";
const COUNTER_ID = "problem-counter";
const ERROR_ID = "problem-error";

export function ProblemSearchForm() {
  const t = useTranslations("Home.search");
  const { applyExample, characterCount, errorKey, isSubmitted, maxLength, minLength, onSubmit, problemField } =
    useProblemForm();

  return (
    <Card className="rounded-panel p-6 shadow-card sm:p-8">
      <form className="grid gap-8 lg:grid-cols-[1fr_20rem]" noValidate onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          <label className="text-lg font-bold text-foreground" htmlFor={FIELD_ID}>
            {t("label")}
          </label>
          <Textarea
            aria-describedby={`${HINT_ID} ${COUNTER_ID}${errorKey ? ` ${ERROR_ID}` : ""}`}
            aria-invalid={errorKey ? true : undefined}
            id={FIELD_ID}
            maxLength={maxLength}
            placeholder={t("placeholder")}
            {...problemField}
          />
          <div className="flex justify-between gap-4 text-sm text-muted">
            <span id={HINT_ID}>{t("hint")}</span>
            <span id={COUNTER_ID}>{t("counter", { count: characterCount, max: maxLength })}</span>
          </div>
          {errorKey ? (
            <p className="font-semibold text-danger" id={ERROR_ID} role="alert">
              {t(`errors.${errorKey}`, { min: minLength, max: maxLength })}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-6">
          <ExamplePrompts onSelect={applyExample} />
          <div className="flex flex-col gap-3">
            <Button size="lg" type="submit" variant="accent">
              {t("submit")}
              <ArrowRight aria-hidden="true" className="size-5" />
            </Button>
            <p aria-live="polite" className="min-h-6 text-sm font-semibold text-primary" role="status">
              {isSubmitted ? t("placeholderNotice") : null}
            </p>
          </div>
        </div>
      </form>
    </Card>
  );
}
