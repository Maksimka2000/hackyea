import { useTranslations } from "next-intl";

import { libraryCategories } from "@/shared/constants/library-categories";
import { Container } from "@/shared/ui/primitives/Container";
import { SectionHeading } from "@/shared/ui/primitives/SectionHeading";

import { CategoryCard } from "./CategoryCard";

export function LibraryCategories() {
  const t = useTranslations("Home.categories");

  return (
    <section aria-labelledby="library-categories-title" className="mt-20">
      <Container>
        <SectionHeading description={t("description")} id="library-categories-title" title={t("title")} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {libraryCategories.map((category) => (
            <li key={category.id}>
              <CategoryCard href={`/library?category=${category.id}`} icon={category.icon} name={category.name} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
