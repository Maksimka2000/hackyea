import { serverApiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { challengeListDtoSchema, materialListDtoSchema, type Challenge, type Material } from "../schemas/knowledgeDtoSchema";

/** For the server component: both lists of the public knowledge store. An unreachable backend gives empty lists. */
export async function getKnowledge(): Promise<{ challenges: Challenge[]; materials: Material[] }> {
  const [challenges, materials] = await Promise.all([
    fetchJson(`${serverApiBaseUrl}/challenges`, { schema: challengeListDtoSchema, cache: "no-store" }).catch(() => []),
    fetchJson(`${serverApiBaseUrl}/materials`, { schema: materialListDtoSchema, cache: "no-store" }).catch(() => []),
  ]);

  return { challenges, materials };
}
