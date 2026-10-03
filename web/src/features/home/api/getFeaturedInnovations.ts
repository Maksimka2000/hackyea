import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { featuredInnovationListDtoSchema } from "../schemas/featuredInnovationDtoSchema";
import type { FeaturedInnovation } from "../types/featured-innovation";
import { mapFeaturedInnovation } from "../utils/mapFeaturedInnovation";

import { getFeaturedInnovationsMock } from "./featuredInnovationsMock";

export async function getFeaturedInnovations(): Promise<FeaturedInnovation[]> {
  const dtos =
    apiModeFor("innovationList") === "mock"
      ? await getFeaturedInnovationsMock()
      : await fetchJson(`${serverApiBaseUrl}/innovations/featured`, { schema: featuredInnovationListDtoSchema });

  return dtos.map(mapFeaturedInnovation);
}
