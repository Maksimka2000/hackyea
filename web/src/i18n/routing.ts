import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // Polish only: the brief allows no other language. Texts still live in messages/pl.json, never in code.
  locales: ["pl"],
  defaultLocale: "pl",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
