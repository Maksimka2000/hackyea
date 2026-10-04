"use client";

import { Send } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Button } from "@/shared/ui/primitives/Button";
import { Card } from "@/shared/ui/primitives/Card";

type SubmitCanvasPanelProps = Readonly<{
  submitted: boolean;
  submissionId: string | null;
  isSubmitting: boolean;
  error?: string;
  onSubmit: () => void;
}>;

export function SubmitCanvasPanel({ error, isSubmitting, onSubmit, submissionId, submitted }: SubmitCanvasPanelProps) {
  const t = useTranslations("Canvas.submit");

  return (
    <Card className="flex flex-col items-start gap-3 bg-tint p-6">
      <h2 className="text-xl font-bold text-foreground">{t("title")}</h2>
      {submitted && submissionId ? (
        <p className="text-foreground">
          {t("done")}{" "}
          <Link className="font-semibold text-primary underline" href={`/my-submissions/${submissionId}`}>
            {t("open")}
          </Link>
        </p>
      ) : (
        <>
          <p className="text-muted">{t("text")}</p>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            <Send aria-hidden="true" className="size-5" />
            {isSubmitting ? t("sending") : t("send")}
          </Button>
          {error ? (
            <p className="font-semibold text-danger" role="alert">
              {error === "generic" ? t("error") : error}
            </p>
          ) : null}
        </>
      )}
    </Card>
  );
}
