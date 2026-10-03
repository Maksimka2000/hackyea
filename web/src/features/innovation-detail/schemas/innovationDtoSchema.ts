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
});

export const innovationListDtoSchema = z.array(innovationDtoSchema);

export type InnovationDto = z.infer<typeof innovationDtoSchema>;
