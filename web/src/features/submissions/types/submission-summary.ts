import type { SubmissionStatus, SubmissionType } from "@/shared/submissions/submissionModel";

export type SubmissionSummary = {
  id: string;
  number: string;
  type: SubmissionType;
  title: string;
  status: SubmissionStatus;
  categoryName: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
};

export type SimilarInnovation = { id: string; title: string; categoryName: string };
