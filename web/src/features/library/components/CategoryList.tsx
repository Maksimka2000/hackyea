import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/shared/lib/cn";

import type { LibraryCategory } from "../types/library";

type CategoryListProps = Readonly<{
  categories: LibraryCategory[];
  /** Id of the category being shown; undefined when the whole library is shown. */
  activeId: string | undefined;
  totalCount: number;
}>;

type CategoryLinkProps = Readonly<{
  href: string;
  isActive: boolean;
  label: string;
  count: number;
}>;

function CategoryLink({ count, href, isActive, label }: CategoryLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-baseline justify-between gap-3 border-l-4 py-2.5 pr-3 pl-4 text-foreground hover:bg-tint",
        isActive ? "border-primary bg-tint font-extrabold text-primary" : "border-transparent font-semibold",
      )}
      href={href}
    >
      <span>{label}</span>
      <span className="text-sm font-normal text-muted">{count}</span>
    </Link>
  );
}

/** One link per category, each with its own shareable address. */
export function CategoryList({ activeId, categories, totalCount }: CategoryListProps) {
  const t = useTranslations("Library.nav");

  return (
    <ul className="flex flex-col">
      <li>
        <CategoryLink count={totalCount} href="/library" isActive={!activeId} label={t("all")} />
      </li>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryLink
            count={category.count}
            href={`/library?category=${category.id}`}
            isActive={category.id === activeId}
            label={category.name}
          />
        </li>
      ))}
    </ul>
  );
}
