import { cache } from "react";

import { apiModeFor, serverApiBaseUrl } from "@/shared/config/env";
import { ApiError } from "@/shared/lib/api-error";
import { fetchJson } from "@/shared/lib/fetch-json";

import { submissionStatusDtoSchema } from "../schemas/submissionDtoSchema";
import type { SubmissionView } from "../types/submission-view";
import { mapSubmissionStatus } from "../utils/mapSubmissionStatus";

import { getSubmissionStatusMock } from "./submissionsMock";

/** Returns null when the token matches no submission. Cached per request so metadata and page share one call. */
export const getSubmissionStatus = cache(async (token: string): Promise<SubmissionView | null> => {
  try {
    const dto =
      apiModeFor("submissions") === "mock"
        ? await getSubmissionStatusMock(token)
        : // PLACEHOLDER endpoint: replace when the backend defines it.
          await fetchJson(`${serverApiBaseUrl}/submissions/${encodeURIComponent(token)}`, {
            schema: submissionStatusDtoSchema,
          });

    return dto ? mapSubmissionStatus(token, dto) : null;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
});
