import { z } from "zod";

/* Backend: GET /api/categories (InnovationCategorySummaryResponse) and GET /api/innovations?categoryId= (InnovationSummaryResponse). */
export const libraryCategoryDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  innovationCount: z.number(),
});

export const libraryCategoryListDtoSchema = z.array(libraryCategoryDtoSchema);

export const libraryInnovationDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  tagline: z.string().nullable(),
  category: z.object({
    id: z.string(),
    name: z.string(),
  }),
  disseminationBadge: z.string().nullable().optional(),
});

export const libraryInnovationListDtoSchema = z.array(libraryInnovationDtoSchema);

export type LibraryCategoryDto = z.infer<typeof libraryCategoryDtoSchema>;
export type LibraryInnovationDto = z.infer<typeof libraryInnovationDtoSchema>;
