import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { innovationListDtoSchema } from "../schemas/innovationDtoSchema";
import type { RelatedInnovation } from "../types/innovation-detail";
import { mapRelatedInnovation } from "../utils/mapInnovationDetail";

import { getRelatedInnovationsMock } from "./innovationMock";

export async function getRelatedInnovations(id: string): Promise<RelatedInnovation[]> {
  const dtos =
    apiModeFor("innovations") === "mock"
      ? await getRelatedInnovationsMock(id)
      : // PLACEHOLDER endpoint: replace when the backend defines it.
        await fetchJson(`${serverApiBaseUrl}/innovations/${encodeURIComponent(id)}/related`, {
          schema: innovationListDtoSchema,
        });

  return dtos.map(mapRelatedInnovation);
}
