import type { CanvasDto } from "../schemas/canvasDtoSchema";
import type { Canvas, CanvasContent, PlanContent, PlanRow } from "../types/canvas";

/** Reads the stored JSON defensively: anything of an unexpected shape is dropped rather than breaking the editor. */
export function mapCanvas(dto: CanvasDto): Canvas {
  const content: CanvasContent = {};
  for (const [key, value] of Object.entries(dto.content)) {
    if (typeof value === "string" || typeof value === "number" || value === null) {
      content[key] = value;
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      content[key] = mapPlan(value as Record<string, unknown>);
    }
  }

  return {
    id: dto.id,
    templateKey: dto.templateKey,
    title: dto.title,
    content,
    submissionId: dto.submissionId,
    updatedAt: new Date(dto.updatedAt),
    warnings: dto.warnings,
  };
}

function mapPlan(raw: Record<string, unknown>): PlanContent {
  const plan: PlanContent = {};
  for (const [phase, rows] of Object.entries(raw)) {
    if (Array.isArray(rows)) {
      plan[phase] = rows.filter((row): row is Record<string, unknown> => Boolean(row) && typeof row === "object").map(mapRow);
    }
  }
  return plan;
}

function mapRow(row: Record<string, unknown>): PlanRow {
  return {
    action: typeof row.action === "string" ? row.action : "",
    from: typeof row.from === "string" ? row.from : "",
    to: typeof row.to === "string" ? row.to : "",
    cost: typeof row.cost === "number" ? row.cost : null,
  };
}

/** Sum of plan costs, shown next to the requested amount. */
export function planTotal(plan: PlanContent | undefined): number {
  return Object.values(plan ?? {})
    .flat()
    .reduce((sum, row) => sum + (row.cost ?? 0), 0);
}
