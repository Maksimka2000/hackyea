/** Where the HubMI backend runs (docker-compose.hubmi.yml publishes it on port 8081). Used by the Next.js server only. */
export const apiOrigin = process.env.API_ORIGIN ?? "http://localhost:8081";
