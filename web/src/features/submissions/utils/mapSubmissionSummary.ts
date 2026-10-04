import type { SubmissionSummaryDto } from "../schemas/submissionDtoSchema";
import type { SubmissionSummary } from "../types/submission-summary";

export function mapSubmissionSummary(dto: SubmissionSummaryDto): SubmissionSummary {
  return {
    id: dto.id,
    number: dto.number,
    type: dto.type,
    title: dto.title,
    status: dto.status,
    categoryName: dto.category?.name ?? null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
    messageCount: dto.messageCount,
  };
}
