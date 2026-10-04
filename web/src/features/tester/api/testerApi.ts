import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { feedbackDtoSchema, ratingSummaryDtoSchema, type FeedbackKind, type RatingSummary } from "../schemas/testerDtoSchema";

const base = (innovationId: string) => `${apiBaseUrl}/innovations/${encodeURIComponent(innovationId)}`;

export function getRatingSummary(innovationId: string): Promise<RatingSummary> {
  return fetchJson(`${base(innovationId)}/rating-summary`, { schema: ratingSummaryDtoSchema });
}

export function rateInnovation(innovationId: string, stars: number): Promise<RatingSummary> {
  return fetchJson(`${base(innovationId)}/rating`, { method: "PUT", json: { stars }, schema: ratingSummaryDtoSchema });
}

export async function sendFeedback(innovationId: string, kind: FeedbackKind, body: string): Promise<void> {
  await fetchJson(`${base(innovationId)}/feedback`, { method: "POST", json: { kind, body }, schema: feedbackDtoSchema });
}
