import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

import { apiOrigin } from "./src/shared/config/api-origin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The browser only talks to this site; /api/* is forwarded to the backend, so no CORS setup is needed.
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${apiOrigin}/api/:path*` }];
  },
};

export default withNextIntl(nextConfig);
