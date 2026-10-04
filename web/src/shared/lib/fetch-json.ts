import { z } from "zod";

import { ApiError, type ApiProblem } from "./api-error";
import { clearAuthSession, getAccessToken } from "./auth-session";

type FetchJsonOptions<TSchema extends z.ZodTypeAny | undefined> = RequestInit & {
  schema?: TSchema;
  /** JSON body; sets the content type. */
  json?: unknown;
};

type Result<TSchema> = TSchema extends z.ZodTypeAny ? z.infer<TSchema> : unknown;

/**
 * Calls the API. In the browser the signed-in user's access token is attached; a 401 on an authenticated call means the
 * token expired, so the session is cleared (guards then send the user to sign in). Empty answers (204) resolve to undefined.
 */
export async function fetchJson<TSchema extends z.ZodTypeAny | undefined>(
  input: RequestInfo | URL,
  options?: FetchJsonOptions<TSchema>,
): Promise<Result<TSchema>> {
  const { json, schema, headers, ...requestInit } = options ?? {};
  const token = typeof window === "undefined" ? null : getAccessToken();

  const finalHeaders = new Headers(headers);
  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
  }
  if (token) {
    finalHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(input, {
    ...requestInit,
    headers: finalHeaders,
    body: json !== undefined ? JSON.stringify(json) : requestInit.body,
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      clearAuthSession();
    }

    throw new ApiError(response.status, undefined, await readProblem(response));
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return undefined as Result<TSchema>;
  }

  const data: unknown = await response.json();

  if (!schema) {
    return data as Result<TSchema>;
  }

  return schema.parse(data) as Result<TSchema>;
}

async function readProblem(response: Response): Promise<ApiProblem | null> {
  try {
    const body: unknown = await response.json();
    return body && typeof body === "object" ? (body as ApiProblem) : null;
  } catch {
    return null;
  }
}
