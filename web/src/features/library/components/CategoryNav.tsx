import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";
import { Container } from "@/shared/ui/primitives/Container";

import type { LibraryCategory } from "../types/library";

type CategoryNavProps = Readonly<{
  categories: LibraryCategory[];
  /** Id of the category being shown; undefined when the whole library is shown. */
  activeId: string | undefined;
  totalCount: number;
}>;

const baseClasses = "border-line inline-flex items-center gap-2 rounded-full border-border-strong px-4 py-2 text-sm font-bold";
const idleClasses = "bg-surface text-primary hover:border-primary hover:bg-tint";
const activeClasses = "border-primary bg-primary text-primary-foreground";

/** Switches between categories. Every option is a link, so each category has its own shareable address. */
export function CategoryNav({ activeId, categories, totalCount }: CategoryNavProps) {
  const t = useTranslations("Library.nav");

  return (
    <nav aria-label={t("label")} className="mt-8">
      <Container>
        <ul className="flex flex-wrap gap-3">
          <li>
            <Link
              aria-current={activeId ? undefined : "page"}
              className={cn(baseClasses, activeId ? idleClasses : activeClasses)}
              href="/library"
            >
              {t("all")}
              <span className="font-normal">({totalCount})</span>
            </Link>
          </li>
          {categories.map((category) => {
            const isActive = category.id === activeId;

            return (
              <li key={category.id}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(baseClasses, isActive ? activeClasses : idleClasses)}
                  href={`/library?category=${category.id}`}
                >
                  {category.name}
                  <span className="font-normal">({category.count})</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
