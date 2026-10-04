import { apiBaseUrl } from "@/shared/config/env";
import type { AuthSession } from "@/shared/lib/auth-session";
import { fetchJson } from "@/shared/lib/fetch-json";

import { demoAccountListDtoSchema, loginResponseDtoSchema, type DemoAccount, type LoginFormValues } from "../schemas/authDtoSchema";

export type LoginPortal = "public" | "admin";

/** Signs in on the public site or the staff panel; the server refuses an account of the other kind with 403. */
export async function login(portal: LoginPortal, values: LoginFormValues): Promise<AuthSession> {
  const path = portal === "admin" ? "auth/admin/login" : "auth/login";
  const dto = await fetchJson(`${apiBaseUrl}/${path}`, { method: "POST", json: values, schema: loginResponseDtoSchema });

  return {
    accessToken: dto.accessToken,
    expiresAt: Date.now() + dto.expiresInSeconds * 1000,
    user: dto.user,
  };
}

/** Empty when the server does not expose demo accounts (404). */
export async function getDemoAccounts(): Promise<DemoAccount[]> {
  try {
    return await fetchJson(`${apiBaseUrl}/auth/demo-accounts`, { schema: demoAccountListDtoSchema });
  } catch {
    return [];
  }
}
