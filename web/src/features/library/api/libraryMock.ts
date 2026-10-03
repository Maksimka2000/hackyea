import { libraryCategories } from "@/shared/constants/library-categories";

import {
  libraryCategoryListDtoSchema,
  libraryInnovationListDtoSchema,
  type LibraryCategoryDto,
  type LibraryInnovationDto,
} from "../schemas/libraryDtoSchema";

import { mockLibraryCatalog } from "./libraryMockCatalog";

/** Parsed through the same schema as live data, so a drifting mock fails loudly. */
const catalog = libraryInnovationListDtoSchema.parse(mockLibraryCatalog);

const categoryOrder = new Map(libraryCategories.map((category, index) => [category.id, index]));

function sortedCatalog(): LibraryInnovationDto[] {
  return [...catalog].sort(
    (a, b) =>
      (categoryOrder.get(a.category.id) ?? 0) - (categoryOrder.get(b.category.id) ?? 0) || a.title.localeCompare(b.title, "pl"),
  );
}

export async function getLibraryCategoriesMock(): Promise<LibraryCategoryDto[]> {
  return libraryCategoryListDtoSchema.parse(
    libraryCategories.map((category) => ({
      id: category.id,
      name: category.name,
      innovationCount: catalog.filter((card) => card.category.id === category.id).length,
    })),
  );
}

/** Null for an unknown category, like the backend's 404. */
export async function getLibraryInnovationsMock(categoryId: string | undefined): Promise<LibraryInnovationDto[] | null> {
  if (categoryId && !categoryOrder.has(categoryId)) {
    return null;
  }

  return sortedCatalog().filter((card) => !categoryId || card.category.id === categoryId);
}
