import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { libraryCategoryListDtoSchema } from "../schemas/libraryDtoSchema";
import type { LibraryCategory } from "../types/library";
import { mapLibraryCategory } from "../utils/mapLibrary";

import { getLibraryCategoriesMock } from "./libraryMock";

export async function getLibraryCategories(): Promise<LibraryCategory[]> {
  const dtos =
    apiModeFor("innovationList") === "mock"
      ? await getLibraryCategoriesMock()
      : await fetchJson(`${serverApiBaseUrl}/categories`, { schema: libraryCategoryListDtoSchema, cache: "no-store" });

  return dtos.map(mapLibraryCategory);
}
