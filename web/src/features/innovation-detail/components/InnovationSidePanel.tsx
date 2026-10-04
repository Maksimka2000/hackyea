import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { CalloutCard } from "@/shared/ui/composite/CalloutCard";
import { Card } from "@/shared/ui/primitives/Card";

import type { InnovationDetail } from "../types/innovation-detail";
import { buildResourceLinks } from "../utils/buildResourceLinks";

import { ResourceList } from "./ResourceList";
import { SourceButton } from "./SourceButton";

type InnovationSidePanelProps = Readonly<{
  innovation: InnovationDetail;
  extra?: ReactNode;
}>;

export function InnovationSidePanel({ extra, innovation }: InnovationSidePanelProps) {
  const t = useTranslations("InnovationDetail");
  const resourceLinks = buildResourceLinks(innovation.resources);

  return (
    <aside aria-label={t("panel.title")} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-5 p-5">
        <h2 className="text-lg font-bold text-foreground">{t("panel.title")}</h2>
        <SourceButton href={innovation.sourceUrl} />
        {resourceLinks.length > 0 ? <ResourceList links={resourceLinks} /> : null}
      </Card>
      {extra}
      <CalloutCard ctaLabel={t("cta.cta")} href="/submit?type=need" text={t("cta.text")} title={t("cta.title")} />
    </aside>
  );
}
