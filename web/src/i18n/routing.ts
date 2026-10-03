import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["pl", "en"],
  defaultLocale: "pl",
  // Polish is the primary language: do not switch by browser language, the visitor picks EN explicitly.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
