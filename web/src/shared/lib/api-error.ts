/** Thrown for non-2xx API responses so callers can react to the status (for example 429 rate limiting). */
export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message?: string) {
    super(message ?? `Request failed with status ${status}.`);
    this.name = "ApiError";
    this.status = status;
  }
}
