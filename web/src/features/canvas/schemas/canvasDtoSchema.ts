import { z } from "zod";

/** GET /api/canvas-templates: boards built from the ROPS call form (sections 1 and 3–11). */
export const canvasTemplateListDtoSchema = z.array(
  z.object({
    key: z.string(),
    title: z.string(),
    description: z.string(),
    source: z.string(),
    boards: z.array(
      z.object({
        key: z.string(),
        number: z.string(),
        title: z.string(),
        hint: z.string().nullable(),
        questions: z.array(z.string()),
        type: z.enum(["text", "amount", "plan"]),
        maxLength: z.number().nullable(),
        phases: z.array(z.object({ key: z.string(), title: z.string(), hint: z.string().nullable(), period: z.string() })).nullable(),
        periods: z.array(z.object({ key: z.string(), title: z.string(), maxMonths: z.number() })).nullable(),
      }),
    ),
  }),
);

export const canvasSummaryListDtoSchema = z.array(
  z.object({ id: z.string(), templateKey: z.string(), title: z.string(), submitted: z.boolean(), updatedAt: z.string() }),
);

export const canvasDtoSchema = z.object({
  id: z.string(),
  templateKey: z.string(),
  title: z.string(),
  content: z.record(z.string(), z.unknown()),
  submissionId: z.string().nullable(),
  updatedAt: z.string(),
  warnings: z.array(z.object({ code: z.string(), message: z.string(), board: z.string().nullable() })),
});

export const submittedCanvasDtoSchema = z.object({ id: z.string(), number: z.string() });

export type CanvasTemplateDto = z.infer<typeof canvasTemplateListDtoSchema>[number];
export type CanvasBoardDto = CanvasTemplateDto["boards"][number];
export type CanvasDto = z.infer<typeof canvasDtoSchema>;
