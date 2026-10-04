"use client";

import { useSyncExternalStore } from "react";

import {
  getAuthSessionSnapshot,
  getServerAuthSessionSnapshot,
  subscribeToAuthSession,
  type AuthSession,
} from "@/shared/lib/auth-session";

/** The signed-in session: undefined before hydration (render nothing session-specific yet), null when signed out. */
export function useAuthSession() {
  return useSyncExternalStore<AuthSession | null | undefined>(
    subscribeToAuthSession,
    getAuthSessionSnapshot,
    getServerAuthSessionSnapshot,
  );
}
