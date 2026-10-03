import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

import type { LibraryGroup } from "../types/library";

import { LibraryRow } from "./LibraryRow";

type LibraryGroupSectionProps = Readonly<{
  group: LibraryGroup;
  /** Show the category name as a heading (whole-library view); a single category is already named by the page. */
  showHeading: boolean;
}>;

export function LibraryGroupSection({ group, showHeading }: LibraryGroupSectionProps) {
  const t = useTranslations("Library.group");
  const headingId = `library-group-${group.category.id}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className={showHeading ? "text-2xl font-extrabold text-foreground" : "sr-only"} id={headingId}>
          {group.category.name}
        </h2>
        {showHeading ? (
          <Link className="font-bold text-primary underline underline-offset-4" href={`/library?category=${group.category.id}`}>
            {t("viewAll", { count: group.items.length })}
            <span className="sr-only"> – {group.category.name}</span>
          </Link>
        ) : null}
      </div>
      <ul className="border-line overflow-hidden rounded-card border-border-strong bg-surface">
        {group.items.map((item) => (
          <li className="border-t-(length:--line-width) border-border first:border-t-0" key={item.id}>
            <LibraryRow item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
