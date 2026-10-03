import type { SubmissionStatus } from "../constants/submission-statuses";
import type { SubmissionType } from "../constants/submission-types";

/** What the status page needs. Independent of the backend's field names. */
export type SubmissionView = {
  token: string;
  reference: string;
  type: SubmissionType;
  status: SubmissionStatus;
  createdAt: Date;
  title: string | null;
  descriptionParagraphs: string[];
  reply: { paragraphs: string[]; repliedAt: Date } | null;
};
