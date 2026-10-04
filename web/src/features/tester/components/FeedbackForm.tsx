"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { FEEDBACK_MAX_LENGTH, FEEDBACK_MIN_LENGTH, feedbackKinds, type FeedbackKind } from "../schemas/testerDtoSchema";

type FeedbackFormProps = Readonly<{
  onSend: (kind: FeedbackKind, body: string) => Promise<boolean>;
  isSending: boolean;
  failed: boolean;
  sentKind: FeedbackKind | null;
}>;

/** An opinion or a concrete improvement proposal; both go to ROPS staff for review. */
export function FeedbackForm({ failed, isSending, onSend, sentKind }: FeedbackFormProps) {
  const t = useTranslations("Tester.feedback");
  const [kind, setKind] = useState<FeedbackKind>("feedback");
  const [body, setBody] = useState("");
  const [tooShort, setTooShort] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (body.trim().length < FEEDBACK_MIN_LENGTH) {
      setTooShort(true);
      return;
    }
    setTooShort(false);
    if (await onSend(kind, body.trim())) {
      setBody("");
    }
  };

  return (
    <form className="flex flex-col gap-3" noValidate onSubmit={submit}>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 font-bold text-foreground">{t("legend")}</legend>
        {feedbackKinds.map((option) => (
          <label className="flex items-center gap-2" key={option}>
            <input
              checked={kind === option}
              className="size-5 accent-primary"
              name="feedback-kind"
              onChange={() => setKind(option)}
              type="radio"
            />
            <span className="text-foreground">{t(`kinds.${option}`)}</span>
          </label>
        ))}
      </fieldset>
      <FormField error={tooShort ? t("tooShort", { min: FEEDBACK_MIN_LENGTH }) : undefined} id="innovation-feedback" label={t(`label.${kind}`)}>
        {(controlProps) => (
          <Textarea
            className="min-h-24"
            maxLength={FEEDBACK_MAX_LENGTH}
            onChange={(event) => setBody(event.target.value)}
            value={body}
            {...controlProps}
          />
        )}
      </FormField>
      <Button className="self-start" disabled={isSending} type="submit" variant="outline">
        {isSending ? t("sending") : t("send")}
      </Button>
      <p aria-live="polite" className="text-sm" role="status">
        {failed ? <span className="text-danger">{t("failed")}</span> : null}
        {!failed && sentKind ? <span className="font-semibold text-primary">{t(`thanks.${sentKind}`)}</span> : null}
      </p>
    </form>
  );
}
