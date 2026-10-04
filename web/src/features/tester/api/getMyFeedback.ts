import { apiBaseUrl } from "@/shared/config/env";
import { fetchJson } from "@/shared/lib/fetch-json";

import { myFeedbackListDtoSchema, type MyFeedback } from "../schemas/myFeedbackDtoSchema";

export async function getMyFeedback(): Promise<MyFeedback[]> {
  const dtos = await fetchJson(`${apiBaseUrl}/me/feedback`, { schema: myFeedbackListDtoSchema });
  return dtos.map((dto) => ({ ...dto, createdAt: new Date(dto.createdAt), reviewedAt: dto.reviewedAt ? new Date(dto.reviewedAt) : null }));
}
