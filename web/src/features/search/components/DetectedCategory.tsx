import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { libraryCategoryIcon } from "@/shared/constants/library-categories";

import { CategoryIconLink } from "./CategoryIconLink";
import type { DetectedCategory as DetectedCategoryData } from "../types/match-result";

type DetectedCategoryProps = Readonly<{
  category: DetectedCategoryData;
  isLowConfidence: boolean;
}>;

/** The library category the description seems to belong to, with a link to browse it; hedged when the match is weak. */
export function DetectedCategory({ category, isLowConfidence }: DetectedCategoryProps) {
  const t = useTranslations("Search.category");

  return (
    <section aria-label={t("label")} className="flex flex-col gap-2 rounded-card bg-tint p-5">
      <p className="text-sm font-semibold text-muted">{t(isLowConfidence ? "probably" : "detected")}</p>
      <CategoryIconLink href={`/library?category=${category.id}`} icon={libraryCategoryIcon(category.id)}>
        {category.name}
        <span className="sr-only"> – {t("browse")}</span>
      </CategoryIconLink>
      {category.alsoRelated.length > 0 ? (
        <p className="text-sm text-muted">
          {t("alsoRelated")}{" "}
          {category.alsoRelated.map((related, index) => (
            <span key={related.id}>
              {index > 0 ? ", " : null}
              <Link className="font-semibold text-primary underline underline-offset-4" href={`/library?category=${related.id}`}>
                {related.name}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
    </section>
  );
}
