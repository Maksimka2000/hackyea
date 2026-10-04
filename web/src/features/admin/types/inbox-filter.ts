import type { SubmissionStatus, SubmissionType } from "@/shared/submissions/submissionModel";

export type InboxFilter = {
  status?: SubmissionStatus;
  type?: SubmissionType;
  categoryId?: string;
  unseen: boolean;
  q?: string;
  page: number;
  pageSize: number;
};
