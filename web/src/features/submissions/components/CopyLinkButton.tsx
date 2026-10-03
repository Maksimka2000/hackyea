"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCopyToClipboard } from "@/shared/hooks/useCopyToClipboard";
import { Button } from "@/shared/ui/primitives/Button";

/** Copies the private status link (this page's address without the "just created" flag). */
export function CopyLinkButton() {
  const t = useTranslations("SubmissionStatus.created");
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = () => {
    void copy(`${window.location.origin}${window.location.pathname}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button onClick={handleCopy} variant="outline">
        {copied ? <Check aria-hidden="true" className="size-5" /> : <Copy aria-hidden="true" className="size-5" />}
        {t("copy")}
      </Button>
      <span aria-live="polite" className="font-semibold text-primary" role="status">
        {copied ? t("copied") : null}
      </span>
    </div>
  );
}
