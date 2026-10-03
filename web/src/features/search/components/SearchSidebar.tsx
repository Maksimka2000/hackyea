import { useTranslations } from "next-intl";

import { Card } from "@/shared/ui/primitives/Card";

import { RefineSearchForm } from "./RefineSearchForm";
import { SubmitNeedPrompt } from "./SubmitNeedPrompt";

export function SearchSidebar() {
  const t = useTranslations("Search");

  return (
    <aside aria-label={t("sidebarLabel")} className="flex flex-col gap-6">
      <Card className="p-5">
        <RefineSearchForm />
      </Card>
      <SubmitNeedPrompt />
    </aside>
  );
}
