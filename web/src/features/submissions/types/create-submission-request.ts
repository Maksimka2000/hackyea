import type { IdeaStage } from "../constants/idea-stages";
import type { SubmitterType } from "../constants/submitter-types";
import type { SubmissionType } from "../constants/submission-types";

/** What is sent to the backend. Only fields that apply to the chosen type and were filled in are present. */
export type CreateSubmissionRequest = {
  type: SubmissionType;
  description: string;
  categoryId?: string;
  place?: string;
  submitterType?: SubmitterType;
  email?: string;
  /** Idea only. */
  title?: string;
  targetGroup?: string;
  stage?: IdeaStage;
};
