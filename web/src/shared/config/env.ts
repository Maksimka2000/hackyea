import { apiOrigin } from "./api-origin";

export type ApiMode = "mock" | "live";

/** Each feature can be switched on its own, so finished backend endpoints go live while the rest stay mocked. */
export type ApiFeature = "matching" | "innovations" | "submissions";

function parseMode(value: string | undefined): ApiMode | undefined {
  return value === "live" || value === "mock" ? value : undefined;
}

const defaultMode = parseMode(process.env.NEXT_PUBLIC_API_MODE) ?? "mock";

// NEXT_PUBLIC_ variables must be written out literally so Next.js can inline them in browser code.
const featureModes: Record<ApiFeature, ApiMode | undefined> = {
  matching: parseMode(process.env.NEXT_PUBLIC_API_MODE_MATCHING),
  innovations: parseMode(process.env.NEXT_PUBLIC_API_MODE_INNOVATIONS),
  submissions: parseMode(process.env.NEXT_PUBLIC_API_MODE_SUBMISSIONS),
};

/** "mock" serves fixtures shaped like the agreed contract; "live" calls the backend. */
export function apiModeFor(feature: ApiFeature): ApiMode {
  return featureModes[feature] ?? defaultMode;
}

/** Calls made from the browser go to this same-origin path; next.config.ts proxies it to the backend. */
export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** Calls made by the Next.js server (server components) need the backend's absolute address. */
export const serverApiBaseUrl = `${apiOrigin}/api`;
