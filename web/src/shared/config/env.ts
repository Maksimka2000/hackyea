export type ApiMode = "mock" | "live";

/** "mock" serves fixtures shaped like the agreed contract; "live" calls the backend. */
export const apiMode: ApiMode = process.env.NEXT_PUBLIC_API_MODE === "live" ? "live" : "mock";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";
