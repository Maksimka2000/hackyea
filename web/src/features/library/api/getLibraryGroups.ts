import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";
import { ApiError } from "@/shared/lib/api-error";

import { libraryInnovationListDtoSchema, type LibraryInnovationDto } from "../schemas/libraryDtoSchema";
import type { LibraryGroup } from "../types/library";
import { groupByCategory } from "../utils/mapLibrary";

import { getLibraryInnovationsMock } from "./libraryMock";

const NOT_FOUND_STATUS = 404;

async function fetchInnovations(categoryId: string | undefined): Promise<LibraryInnovationDto[] | null> {
  if (apiModeFor("innovationList") === "mock") {
    return getLibraryInnovationsMock(categoryId);
  }

  const query = categoryId ? `?categoryId=${encodeURIComponent(categoryId)}` : "";

  try {
    return await fetchJson(`${serverApiBaseUrl}/innovations${query}`, { schema: libraryInnovationListDtoSchema, cache: "no-store" });
  } catch (error) {
    if (error instanceof ApiError && error.status === NOT_FOUND_STATUS) {
      return null;
    }

    throw error;
  }
}

/** The cards grouped by category (one group when a category is given). Null when that category does not exist. */
export async function getLibraryGroups(categoryId: string | undefined): Promise<LibraryGroup[] | null> {
  const dtos = await fetchInnovations(categoryId);

  return dtos ? groupByCategory(dtos) : null;
}
