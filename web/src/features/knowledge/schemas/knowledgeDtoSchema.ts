import { z } from "zod";

/** GET /api/challenges and GET /api/materials (published only). */
export const challengeListDtoSchema = z.array(
  z.object({ id: z.string(), title: z.string(), description: z.string(), categoryId: z.string().nullable(), source: z.string().nullable() }),
);

export const materialListDtoSchema = z.array(
  z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    type: z.enum(["article", "video", "guide"]),
    url: z.string().nullable(),
    body: z.string().nullable(),
  }),
);

export type Challenge = z.infer<typeof challengeListDtoSchema>[number];
export type Material = z.infer<typeof materialListDtoSchema>[number];
