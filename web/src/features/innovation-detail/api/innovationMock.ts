import { innovationDtoSchema, innovationListDtoSchema, type InnovationDto } from "../schemas/innovationDtoSchema";

import { mockInnovationCatalog } from "./innovationMockCatalog";

const RELATED_LIMIT = 3;

/** Parsed through the same schema as live data, so a drifting mock fails loudly. */
const catalog = innovationListDtoSchema.parse(mockInnovationCatalog);

export async function getInnovationMock(id: string): Promise<InnovationDto | null> {
  const entry = catalog.find((candidate) => candidate.id === id);

  return entry ? innovationDtoSchema.parse(entry) : null;
}

export async function getRelatedInnovationsMock(id: string): Promise<InnovationDto[]> {
  const current = catalog.find((candidate) => candidate.id === id);

  if (!current) {
    return [];
  }

  return catalog
    .filter((candidate) => candidate.id !== id && candidate.category.id === current.category.id)
    .slice(0, RELATED_LIMIT);
}
