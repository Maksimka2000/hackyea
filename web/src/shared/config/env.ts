export type ApiMode = "mock" | "live";

/** "mock" serves fixtures shaped like the agreed contract; "live" calls the backend. */
export const apiMode: ApiMode = process.env.NEXT_PUBLIC_API_MODE === "live" ? "live" : "mock";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api";

/** Backend URL for calls made by the Next.js server (server components need an absolute URL). */
export const serverApiBaseUrl = process.env.API_SERVER_URL ?? "http://localhost:5000/api";
