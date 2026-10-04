import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

import { AdminPageHeader } from "../shell/AdminPageHeader";

import { ChallengesTab } from "./ChallengesTab";
import { InnovationsTab } from "./InnovationsTab";
import { MaterialsTab } from "./MaterialsTab";

export const knowledgeTabs = ["innovations", "challenges", "materials"] as const;
export type KnowledgeTab = (typeof knowledgeTabs)[number];

type AdminKnowledgePageProps = Readonly<{
  tab: KnowledgeTab;
}>;

/** Add, edit, verify and publish innovations, challenges and materials. The tab is in the URL. */
export function AdminKnowledgePage({ tab }: AdminKnowledgePageProps) {
  const t = useTranslations("Admin.knowledge");

  return (
    <>
      <AdminPageHeader lead={t("lead")} title={t("title")} />
      <nav aria-label={t("tabsLabel")} className="mb-6">
        <ul className="border-line inline-flex flex-wrap overflow-hidden rounded-control border-border-strong">
          {knowledgeTabs.map((key) => (
            <li key={key}>
              <Link
                aria-current={key === tab ? "page" : undefined}
                className={cn("block px-5 py-3 font-bold", key === tab ? "bg-primary text-primary-foreground" : "bg-surface text-primary hover:bg-tint")}
                href={`/admin/knowledge?tab=${key}`}
              >
                {t(`tabs.${key}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      {tab === "innovations" ? <InnovationsTab /> : null}
      {tab === "challenges" ? <ChallengesTab /> : null}
      {tab === "materials" ? <MaterialsTab /> : null}
    </>
  );
}
