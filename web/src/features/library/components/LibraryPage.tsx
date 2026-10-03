import { notFound } from "next/navigation";

import { Container } from "@/shared/ui/primitives/Container";

import { getLibraryCategories } from "../api/getLibraryCategories";
import { getLibraryGroups } from "../api/getLibraryGroups";

import { CategoryNav } from "./CategoryNav";
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
      <CategoryNav activeId={selected?.id} categories={categories} totalCount={totalCount} />
      <Container className="mt-10 flex flex-col gap-14">
        {groups.length > 0 ? (
          groups.map((group) => <LibraryGroupSection group={group} key={group.category.id} showHeading={!selected} />)
        ) : (
          <LibraryEmpty />
        )}
      </Container>
    </>
  );
}
