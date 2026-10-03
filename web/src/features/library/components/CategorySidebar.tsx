import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { CategoryList } from "./CategoryList";
import type { LibraryCategory } from "../types/library";

type CategorySidebarProps = Readonly<{
  categories: LibraryCategory[];
  activeId: string | undefined;
  totalCount: number;
}>;

/*
  A side list on wide screens and a collapsible list on narrow ones. The list is rendered twice and one copy is
  `display: none` at each width, so assistive technology only ever sees one navigation.
*/
export function CategorySidebar({ activeId, categories, totalCount }: CategorySidebarProps) {
  const t = useTranslations("Library.nav");
  const list = <CategoryList activeId={activeId} categories={categories} totalCount={totalCount} />;

  return (
    <>
      <nav aria-label={t("label")} className="hidden lg:block">
        <p className="mb-3 text-sm font-extrabold tracking-wide text-muted uppercase">{t("title")}</p>
        {list}
      </nav>
      <nav aria-label={t("label")} className="lg:hidden">
        <details className="border-line group rounded-card border-border-strong bg-surface">
          <summary className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 font-extrabold text-primary">
            {t("title")}
            <ChevronDown aria-hidden="true" className="size-5 transition-transform group-open:rotate-180" />
          </summary>
          <div className="border-t-(length:--line-width) border-border py-2">{list}</div>
        </details>
      </nav>
    </>
  );
}
