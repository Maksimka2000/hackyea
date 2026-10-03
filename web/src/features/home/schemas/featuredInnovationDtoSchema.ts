import { z } from "zod";

/*
  Backend: GET /api/innovations/featured (InnovationSummaryResponse). Update this file and `mapFeaturedInnovation`
  when the response changes.
*/
export const featuredInnovationDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const featuredInnovationListDtoSchema = z.array(featuredInnovationDtoSchema);

export type FeaturedInnovationDto = z.infer<typeof featuredInnovationDtoSchema>;
