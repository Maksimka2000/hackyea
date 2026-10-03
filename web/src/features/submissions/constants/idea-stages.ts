export const ideaStages = ["concept", "preparing", "tested", "running"] as const;

export type IdeaStage = (typeof ideaStages)[number];

export function isIdeaStage(value: unknown): value is IdeaStage {
  return ideaStages.some((stage) => stage === value);
}
