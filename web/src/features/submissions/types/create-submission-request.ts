import type { IdeaStage } from "../constants/idea-stages";
import type { SubmissionType } from "../constants/submission-types";

/** POST /api/submissions body. Only fields that apply to the chosen type and were filled in are present. */
export type CreateSubmissionRequest = {
  type: SubmissionType;
  description: string;
  title?: string;
  categoryId?: string;
  place?: string;
  targetGroup?: string;
  stage?: IdeaStage;
  pilotScale?: string;
  results?: string;
  /** Library cards shown on the last search; sent with needs and local challenges. */
  seenInnovationIds?: string[];
};
