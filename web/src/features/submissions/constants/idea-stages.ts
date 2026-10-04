import { ideaStages, type IdeaStage } from "@/shared/submissions/submissionModel";

export { ideaStages, type IdeaStage };

export function isIdeaStage(value: unknown): value is IdeaStage {
  return ideaStages.some((stage) => stage === value);
}
