import { z } from "zod";

/* Backend: GET /api/innovations?categoryId= (InnovationSummaryResponse). Categories live in `shared/library`. */
export const libraryInnovationDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  disseminationBadge: z.string().nullable().optional(),
  hasVideo: z.boolean(),
  hasEvidence: z.boolean(),
});

export const libraryInnovationListDtoSchema = z.array(libraryInnovationDtoSchema);

export type LibraryInnovationDto = z.infer<typeof libraryInnovationDtoSchema>;
