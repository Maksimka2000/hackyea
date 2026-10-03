import { z } from "zod";

/* Backend: GET /api/categories (InnovationCategorySummaryResponse). */
export const libraryCategoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  innovationCount: z.number(),
});

export const libraryCategoryListDtoSchema = z.array(libraryCategoryDtoSchema);

export type LibraryCategoryDto = z.infer<typeof libraryCategoryDtoSchema>;
