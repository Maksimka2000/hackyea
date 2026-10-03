import { isIdeaStage } from "../constants/idea-stages";
import { isSubmitterType } from "../constants/submitter-types";
import type { SubmissionFormValues } from "../schemas/submissionFormSchema";
import type { CreateSubmissionRequest } from "../types/create-submission-request";

/** Turns validated form values into the request body: empty optionals are dropped, idea-only fields apply to ideas. */
export function buildSubmissionPayload(values: SubmissionFormValues): CreateSubmissionRequest {
  const payload: CreateSubmissionRequest = {
    type: values.type,
    description: values.description,
  };

  if (values.areaId) {
    payload.areaId = values.areaId;
  }

  if (values.place) {
    payload.place = values.place;
  }

  if (isSubmitterType(values.submitterType)) {
    payload.submitterType = values.submitterType;
  }

  // The address is only sent when the person agreed to receive the link there.
  if (values.email && values.emailConsent) {
    payload.email = values.email;
  }

  if (values.type === "idea") {
    payload.title = values.title;
    payload.targetGroup = values.targetGroup;

    if (isIdeaStage(values.stage)) {
      payload.stage = values.stage;
    }
  }

  return payload;
}
