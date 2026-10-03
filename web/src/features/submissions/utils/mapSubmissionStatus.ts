import { splitParagraphs } from "@/shared/lib/split-paragraphs";

import type { SubmissionStatusDto } from "../schemas/submissionDtoSchema";
import type { SubmissionView } from "../types/submission-view";

export function mapSubmissionStatus(token: string, dto: SubmissionStatusDto): SubmissionView {
  return {
    token,
    reference: dto.reference,
    type: dto.type,
    status: dto.status,
    createdAt: new Date(dto.createdAt),
    title: dto.title,
    descriptionParagraphs: splitParagraphs(dto.description),
    reply: dto.reply
      ? { paragraphs: splitParagraphs(dto.reply.text), repliedAt: new Date(dto.reply.repliedAt) }
      : null,
  };
}
