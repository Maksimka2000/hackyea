import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import type { LibraryCategory } from "./library-category";
import { getLibraryCategoriesMock } from "./libraryCategoriesMock";
import { libraryCategoryListDtoSchema } from "./libraryCategoryDtoSchema";
import { mapLibraryCategory } from "./mapLibraryCategory";

/** The categories with their card counts, in the backend's display order. For server components. */
export async function getLibraryCategories(): Promise<LibraryCategory[]> {
  const dtos =
    apiModeFor("innovationList") === "mock"
      ? await getLibraryCategoriesMock()
      : await fetchJson(`${serverApiBaseUrl}/categories`, { schema: libraryCategoryListDtoSchema });

  return dtos.map(mapLibraryCategory);
}
