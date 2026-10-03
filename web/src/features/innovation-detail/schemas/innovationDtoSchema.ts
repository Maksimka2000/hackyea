import { z } from "zod";

/*
  PROPOSED contract for the innovation endpoints (simple on purpose, to be replaced by the agreed shape).
  Update this file and the mappers in `utils/` when the backend response is final.
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
  links: z.object({
    video: z.string().nullable(),
    materials: z.string().nullable(),
    detailsPdf: z.string().nullable(),
    license: z.string().nullable(),
  }),
});

export const innovationListDtoSchema = z.array(innovationDtoSchema);

export type InnovationDto = z.infer<typeof innovationDtoSchema>;
