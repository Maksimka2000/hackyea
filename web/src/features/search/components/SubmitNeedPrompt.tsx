import { useTranslations } from "next-intl";

import { CalloutCard } from "@/shared/ui/composite/CalloutCard";

export function SubmitNeedPrompt() {
  const t = useTranslations("Search.submitPrompt");

  return <CalloutCard ctaLabel={t("cta")} href="/submit?type=need" text={t("text")} title={t("title")} />;
}
