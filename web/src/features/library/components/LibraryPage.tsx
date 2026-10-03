import { notFound } from "next/navigation";

import { Container } from "@/shared/ui/primitives/Container";

import { getLibraryCategories } from "../api/getLibraryCategories";
import { getLibraryGroups } from "../api/getLibraryGroups";

import { CategorySidebar } from "./CategorySidebar";
import { LibraryEmpty } from "./LibraryEmpty";
import { LibraryGroupSection } from "./LibraryGroupSection";
import { LibraryHeader } from "./LibraryHeader";

type LibraryPageProps = Readonly<{
  categoryId: string | undefined;
}>;

export async function LibraryPage({ categoryId }: LibraryPageProps) {
  const [categories, groups] = await Promise.all([getLibraryCategories(), getLibraryGroups(categoryId)]);
  const selected = categoryId ? categories.find((category) => category.id === categoryId) : undefined;

  if (!groups || (categoryId && !selected)) {
    notFound();
  }

  const totalCount = categories.reduce((sum, category) => sum + category.count, 0);

  return (
    <>
      <LibraryHeader categoryName={selected?.name} count={selected ? selected.count : totalCount} />
      <Container className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-12">
        <CategorySidebar activeId={selected?.id} categories={categories} totalCount={totalCount} />
        <div className="flex min-w-0 flex-col gap-12">
          {groups.length > 0 ? (
            groups.map((group) => <LibraryGroupSection group={group} key={group.category.id} showHeading={!selected} />)
          ) : (
            <LibraryEmpty />
          )}
        </div>
      </Container>
    </>
  );
}
