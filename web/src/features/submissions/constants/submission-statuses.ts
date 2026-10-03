/** In the order a submission moves through; labels live in messages (`SubmissionStatus.timeline.steps.<status>`). */
export const submissionStatuses = ["received", "in-review", "answered", "closed"] as const;

export type SubmissionStatus = (typeof submissionStatuses)[number];
