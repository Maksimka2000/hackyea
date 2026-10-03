import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { relatedInnovationListDtoSchema } from "../schemas/innovationDtoSchema";
import type { RelatedInnovation } from "../types/innovation-detail";
import { mapRelatedInnovation } from "../utils/mapInnovationDetail";

import { getRelatedInnovationsMock } from "./innovationMock";

export async function getRelatedInnovations(id: string): Promise<RelatedInnovation[]> {
  const dtos =
    apiModeFor("innovationList") === "mock"
      ? await getRelatedInnovationsMock(id)
      : await fetchJson(`${serverApiBaseUrl}/innovations/${encodeURIComponent(id)}/related`, {
          schema: relatedInnovationListDtoSchema,
        });

  return dtos.map(mapRelatedInnovation);
}
