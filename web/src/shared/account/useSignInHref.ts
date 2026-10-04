"use client";

import { useSearchParams } from "next/navigation";

import { usePathname } from "@/i18n/navigation";

/**
 * The sign-in page address that returns here afterwards. Only the path and the existing query (e.g. `type=idea`) travel;
 * free text never goes into URLs.
 */
export function useSignInHref(portal: "public" | "admin" = "public") {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const returnTo = search ? `${pathname}?${search}` : pathname;
  const base = portal === "admin" ? "/admin/login" : "/login";

  return `${base}?returnTo=${encodeURIComponent(returnTo)}`;
}

/** Accepts only same-site paths, so a crafted link cannot send the user elsewhere after signing in. */
export function safeReturnTo(value: string | null | undefined, fallback: string) {
  return value && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}
