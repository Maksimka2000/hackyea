"use client";

import { TriangleAlert } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Button } from "@/shared/ui/primitives/Button";

import { StatusPage } from "./StatusPage";

type ErrorPageProps = Readonly<{
  /** Tries to render the failed page again. */
  onRetry: () => void;
}>;

export function ErrorPage({ onRetry }: ErrorPageProps) {
  const t = useTranslations("Errors.generic");

  return (
    <StatusPage icon={TriangleAlert} text={t("text")} title={t("title")}>
      <Button onClick={onRetry} variant="primary">
        {t("retry")}
      </Button>
      <ButtonLink href="/" variant="outline">
        {t("home")}
      </ButtonLink>
    </StatusPage>
  );
}
