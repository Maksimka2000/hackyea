import { cache } from "react";

import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { ApiError } from "@/shared/lib/api-error";
import { fetchJson } from "@/shared/lib/fetch-json";

import { innovationDtoSchema } from "../schemas/innovationDtoSchema";
import type { InnovationDetail } from "../types/innovation-detail";
import { mapInnovationDetail } from "../utils/mapInnovationDetail";

import { getInnovationMock } from "./innovationMock";

/** Returns null when the innovation does not exist. Cached per request so metadata and page share one call. */
export const getInnovation = cache(async (id: string): Promise<InnovationDetail | null> => {
  try {
    const dto =
      apiModeFor("innovationDetail") === "mock"
        ? await getInnovationMock(id)
        : await fetchJson(`${serverApiBaseUrl}/innovations/${encodeURIComponent(id)}`, { schema: innovationDtoSchema });

    return dto ? mapInnovationDetail(dto) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
});
