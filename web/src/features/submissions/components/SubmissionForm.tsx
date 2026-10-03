"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { FormProvider } from "react-hook-form";

import { Button } from "@/shared/ui/primitives/Button";

import type { SubmissionType } from "../constants/submission-types";
import { useSubmissionForm } from "../hooks/useSubmissionForm";

import { ContactFields } from "./ContactFields";
import { IdeaFields } from "./IdeaFields";
import { NeedFields } from "./NeedFields";
import { SendError } from "./SendError";

type SubmissionFormProps = Readonly<{
  type: SubmissionType;
}>;

export function SubmissionForm({ type }: SubmissionFormProps) {
  const t = useTranslations("Submit");
  const { form, isSending, onSubmit, sendError } = useSubmissionForm(type);

  return (
    <FormProvider {...form}>
      <form className="flex flex-col gap-6" noValidate onSubmit={onSubmit}>
        {type === "need" ? <NeedFields /> : <IdeaFields />}
        <ContactFields />

        {/* Honeypot: hidden from people and screen readers; bots tend to fill it. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            {t("honeypotLabel")}
            <input autoComplete="off" tabIndex={-1} type="text" {...form.register("website")} />
          </label>
        </div>

        {sendError ? <SendError isRateLimited={sendError.isRateLimited} /> : null}

        <Button className="self-start" disabled={isSending} size="lg" type="submit">
          <Send aria-hidden="true" className="size-5" />
          {isSending ? t("sending") : t("submit")}
        </Button>
      </form>
    </FormProvider>
  );
}
