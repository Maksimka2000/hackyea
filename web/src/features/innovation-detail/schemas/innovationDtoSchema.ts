import { z } from "zod";

/*
  PROPOSED contract for the innovation endpoints, which the backend does not serve yet. The field names follow the
  backend's Innovation entity (HubMi.Domain/Innovations/Innovation.cs); `category` is the one addition we need,
  because the entity only stores a CategoryId. Update this file and the mappers in `utils/` once the endpoint exists.
*/
export const innovationDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  solution: z.string().nullable(),
  problems: z.string().nullable(),
  targetGroup: z.string().nullable(),
  beneficiaries: z.string().nullable(),
  evidence: z.string().nullable(),
  sourceUrl: z.string(),
  videoUrl: z.string().nullable(),
  materialsUrl: z.string().nullable(),
  detailsPdfUrl: z.string().nullable(),
  licenseUrl: z.string().nullable(),
  /** Added by the backend (the "Inkubator Włączenia Społecznego" mark). Optional so older mock data still parses. */
  disseminationBadge: z.string().nullable().optional(),
  /** ISO date of the last change; not shown yet. */
  updatedAt: z.string().optional(),
});

/** Backend: GET /api/innovations/{id}/related (InnovationSummaryResponse); the full DTO satisfies it too (mock). */
export const relatedInnovationDtoSchema = innovationDtoSchema.pick({ id: true, title: true, tagline: true, category: true });

export const relatedInnovationListDtoSchema = z.array(relatedInnovationDtoSchema);

export const innovationListDtoSchema = z.array(innovationDtoSchema);

export type InnovationDto = z.infer<typeof innovationDtoSchema>;
export type RelatedInnovationDto = z.infer<typeof relatedInnovationDtoSchema>;
