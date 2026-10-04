import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import {
  canvasDtoSchema,
  canvasSummaryListDtoSchema,
  canvasTemplateListDtoSchema,
  submittedCanvasDtoSchema,
} from "../schemas/canvasDtoSchema";
import type { Canvas, CanvasContent, CanvasSummary, CanvasTemplate } from "../types/canvas";
import { mapCanvas } from "../utils/mapCanvas";

export function getCanvasTemplates(): Promise<CanvasTemplate[]> {
  return fetchJson(`${apiBaseUrl}/canvas-templates`, { schema: canvasTemplateListDtoSchema });
}

export async function getMyCanvases(): Promise<CanvasSummary[]> {
  const dtos = await fetchJson(`${apiBaseUrl}/canvases`, { schema: canvasSummaryListDtoSchema });
  return dtos.map((dto) => ({ id: dto.id, title: dto.title, submitted: dto.submitted, updatedAt: new Date(dto.updatedAt) }));
}

export async function createCanvas(templateKey: string): Promise<Canvas> {
  return mapCanvas(await fetchJson(`${apiBaseUrl}/canvases`, { method: "POST", json: { templateKey }, schema: canvasDtoSchema }));
}

export async function getCanvas(id: string): Promise<Canvas> {
  return mapCanvas(await fetchJson(`${apiBaseUrl}/canvases/${encodeURIComponent(id)}`, { schema: canvasDtoSchema }));
}

/** Saves the title and the whole content; the answer carries fresh non-blocking warnings. */
export async function saveCanvas(id: string, title: string, content: CanvasContent): Promise<Canvas> {
  return mapCanvas(
    await fetchJson(`${apiBaseUrl}/canvases/${encodeURIComponent(id)}`, { method: "PUT", json: { title, content }, schema: canvasDtoSchema }),
  );
}

export async function deleteCanvas(id: string): Promise<void> {
  await fetchJson(`${apiBaseUrl}/canvases/${encodeURIComponent(id)}`, { method: "DELETE" });
}

/** Sends the canvas to ROPS as an idea submission (once). */
export function submitCanvas(id: string) {
  return fetchJson(`${apiBaseUrl}/canvases/${encodeURIComponent(id)}/submit`, { method: "POST", schema: submittedCanvasDtoSchema });
}
