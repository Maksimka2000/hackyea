import { libraryCategories } from "@/shared/constants/library-categories";

import { libraryCategoryListDtoSchema, type LibraryCategoryDto } from "./libraryCategoryDtoSchema";

/* Card counts of the seeded ROPS catalogue (115 cards), in the order of `libraryCategories`. */
const mockCounts: Record<string, number> = {
  "dla-cudzoziemcow": 6,
  "dla-dzieci-mlodziezy-i-rodziny": 21,
  "dla-osob-o-ograniczonej-mobilnosci": 18,
  "dla-osob-w-kryzysie-bezdomnosci": 2,
  "dla-osob-z-niepelnosprawnoscia-intelektualna": 14,
  "dla-osob-z-niepelnosprawnoscia-sensoryczna": 20,
  "dla-rynku-pracy": 5,
  "dla-seniorow": 20,
  "dla-zdrowia-i-medycyny": 9,
};

/** Parsed through the same schema as live data, so a drifting mock fails loudly. */
export async function getLibraryCategoriesMock(): Promise<LibraryCategoryDto[]> {
  return libraryCategoryListDtoSchema.parse(
    libraryCategories.map((category) => ({
      id: category.id,
      name: category.name,
      innovationCount: mockCounts[category.id] ?? 0,
    })),
  );
}
