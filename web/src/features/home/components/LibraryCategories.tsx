import { useTranslations } from "next-intl";

import { libraryCategoryIcon } from "@/shared/constants/library-categories";
import type { LibraryCategory } from "@/shared/library/library-category";
import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import { CategoryCard } from "./CategoryCard";

type LibraryCategoriesProps = Readonly<{
  categories: LibraryCategory[];
}>;

export function LibraryCategories({ categories }: LibraryCategoriesProps) {
  const t = useTranslations("Home.categories");

  return (
    <section aria-labelledby="library-categories-title" className="mt-20">
      <Container>
        <SectionHeading
          description={t("description", { count: categories.length })}
          id="library-categories-title"
          title={t("title")}
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <li key={category.id}>
              <CategoryCard
                countLabel={t("count", { count: category.count })}
                href={`/library?category=${category.id}`}
                icon={libraryCategoryIcon(category.id)}
                name={category.name}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
