export const mySubmissionKeys = {
  all: ["my-submissions"] as const,
  detail: (id: string) => ["my-submissions", id] as const,
};
