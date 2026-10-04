/** RFC 7807 body the backend sends with 4xx answers; `errors` maps a field to its messages (validation). */
export type ApiProblem = {
  title?: string;
  detail?: string;
  type?: string;
  errors?: Record<string, string[]>;
};

/** Thrown for non-2xx API responses so callers can react to the status (for example 429 rate limiting). */
export class ApiError extends Error {
  readonly status: number;
  readonly problem: ApiProblem | null;

  constructor(status: number, message?: string, problem: ApiProblem | null = null) {
    super(message ?? problem?.title ?? `Request failed with status ${status}.`);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }

  /** The first server message for a field, matched case-insensitively (the server uses camelCase keys). */
  fieldError(field: string): string | undefined {
    const errors = this.problem?.errors;
    if (!errors) {
      return undefined;
    }

    const key = Object.keys(errors).find((name) => name.toLowerCase() === field.toLowerCase());
    return key ? errors[key]?.[0] : undefined;
  }
}

export function isApiError(error: unknown, status?: number): error is ApiError {
  return error instanceof ApiError && (status === undefined || error.status === status);
}

/** The server's own message for a refused request (400): the first field error, else the problem title. */
export function serverMessage(error: unknown): string | undefined {
  if (!(error instanceof ApiError) || error.status !== 400) {
    return undefined;
  }

  const firstFieldError = error.problem?.errors ? Object.values(error.problem.errors)[0]?.[0] : undefined;
  return firstFieldError ?? error.problem?.title;
}
