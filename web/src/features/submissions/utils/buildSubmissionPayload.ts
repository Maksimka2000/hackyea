import { isIdeaStage } from "../constants/idea-stages";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";
import type { CreateSubmissionRequest } from "../types/create-submission-request";

/** Turns validated form values into the request body: empty optionals are dropped, card fields apply to ideas and practices. */
export function buildSubmissionPayload(values: SubmissionFormValues): CreateSubmissionRequest {
  const payload: CreateSubmissionRequest = { type: values.type, description: values.description };
  const isCard = values.type === "idea" || values.type === "goodPractice";

  if (values.title) payload.title = values.title;
  if (values.categoryId) payload.categoryId = values.categoryId;
  if (values.place) payload.place = values.place;

  if (isCard) {
    payload.targetGroup = values.targetGroup;
    if (isIdeaStage(values.stage)) payload.stage = values.stage;
  }

  if (values.type === "goodPractice") {
    payload.results = values.results;
    if (values.pilotScale) payload.pilotScale = values.pilotScale;
  }

  return payload;
}
