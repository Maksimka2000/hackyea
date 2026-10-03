import { SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";

import { StatusPage } from "./StatusPage";

export function NotFoundPage() {
  const t = useTranslations("Errors.notFound");

  return (
    <StatusPage icon={SearchX} text={t("text")} title={t("title")}>
      <ButtonLink href="/" variant="primary">
        {t("home")}
      </ButtonLink>
      <ButtonLink href="/library" variant="outline">
        {t("library")}
      </ButtonLink>
    </StatusPage>
  );
}
