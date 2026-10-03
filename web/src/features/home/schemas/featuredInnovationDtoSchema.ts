import { z } from "zod";

/*
  PROPOSED contract: what the backend is expected to send for featured innovations.
  Update this file and `mapFeaturedInnovation` when the real response shape is agreed.
*/
export const featuredInnovationDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
});

export const featuredInnovationListDtoSchema = z.array(featuredInnovationDtoSchema);

export type FeaturedInnovationDto = z.infer<typeof featuredInnovationDtoSchema>;
