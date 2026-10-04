"use client";

import { useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";
import { clearAuthSession } from "@/shared/lib/auth-session";

/** Forgets the token and every cached answer that belonged to the account, then goes home. */
export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    clearAuthSession();
    queryClient.clear();
    router.push("/");
  };
}
