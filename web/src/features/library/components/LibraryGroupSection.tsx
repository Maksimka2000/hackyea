import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { InnovationCard } from "@/shared/ui/composite/InnovationCard";

import type { LibraryGroup } from "../types/library";

type LibraryGroupSectionProps = Readonly<{
  group: LibraryGroup;
  /** Show the category name as a heading (whole-library view); a single category is already named by the page. */
  showHeading: boolean;
}>;

export function LibraryGroupSection({ group, showHeading }: LibraryGroupSectionProps) {
  const t = useTranslations("Library.group");
  const headingId = `library-group-${group.category.id}`;

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-6">
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
      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {group.items.map((item) => (
          <li key={item.id}>
            <InnovationCard {...item} viewLabel={t("viewSolution")} />
          </li>
        ))}
      </ul>
    </section>
  );
}
