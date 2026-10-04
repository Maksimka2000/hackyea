import type { CanvasBoardDto, CanvasTemplateDto } from "../schemas/canvasDtoSchema";

export type CanvasTemplate = CanvasTemplateDto;
export type CanvasBoard = CanvasBoardDto;

/** One step of the action plan: what, when (yyyy-MM months) and at what cost (PLN). */
export type PlanRow = { action: string; from: string; to: string; cost: number | null };

/** Rows grouped by plan phase key (preparation, testPhase1, testPhase2). */
export type PlanContent = Record<string, PlanRow[]>;

/** Answers keyed by board: text, a number (amount) or the plan. */
export type CanvasContent = Record<string, string | number | PlanContent | null>;

export type CanvasWarning = { code: string; message: string; board: string | null };

export type Canvas = {
  id: string;
  templateKey: string;
  title: string;
  content: CanvasContent;
  submissionId: string | null;
  updatedAt: Date;
  warnings: CanvasWarning[];
};

export type CanvasSummary = { id: string; title: string; submitted: boolean; updatedAt: Date };

export type SaveState = "idle" | "saving" | "saved" | "error";
