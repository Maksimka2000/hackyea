"use client";

import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/ui/primitives/Button";
import { FormField } from "@/shared/ui/primitives/FormField";
import { Textarea } from "@/shared/ui/primitives/Textarea";

import { MESSAGE_MAX_LENGTH } from "./submissionModel";

type ReplyFormProps = Readonly<{
  id: string;
  label: string;
  isSending: boolean;
  /** Translated error to show, if the last send failed. */
  error?: string;
  /** Resolves true when the message was sent, so the field can be cleared. */
  onSend: (body: string) => Promise<boolean>;
}>;

export function ReplyForm({ error, id, isSending, label, onSend }: ReplyFormProps) {
  const t = useTranslations("Submission.reply");
  const [body, setBody] = useState("");
  const [touched, setTouched] = useState(false);
  const tooShort = touched && body.trim().length === 0;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    if (body.trim().length === 0) {
      return;
    }
    if (await onSend(body.trim())) {
      setBody("");
      setTouched(false);
    }
  };

  return (
    <form className="flex flex-col gap-3" noValidate onSubmit={submit}>
      <FormField error={tooShort ? t("empty") : error} id={id} label={label}>
        {(controlProps) => (
          <Textarea
            className="min-h-28"
            maxLength={MESSAGE_MAX_LENGTH}
            onChange={(event) => setBody(event.target.value)}
            value={body}
            {...controlProps}
          />
        )}
      </FormField>
      <Button className="self-start" disabled={isSending} type="submit">
        <Send aria-hidden="true" className="size-5" />
        {isSending ? t("sending") : t("send")}
      </Button>
    </form>
  );
}
