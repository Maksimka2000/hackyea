/*
  The signed-in account and its access token, for this browser tab (sessionStorage, with an in-memory copy if storage
  is blocked). There is no refresh token: when the token expires the API answers 401 and the session is cleared.
*/
export type AccountRole = "Resident" | "Ngo" | "Jst" | "Admin";

export type AuthUser = {
  id: string;
  login: string;
  displayName: string;
  role: AccountRole;
  organizationName: string | null;
};

export type AuthSession = {
  accessToken: string;
  /** Epoch milliseconds. */
  expiresAt: number;
  user: AuthUser;
};

const STORAGE_KEY = "hubmi:session";
const listeners = new Set<() => void>();
let current: AuthSession | null | undefined;

function readStored(): AuthSession | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const session = JSON.parse(raw) as AuthSession;
    return session.expiresAt > Date.now() ? session : null;
  } catch {
    return null;
  }
}

function notify() {
  listeners.forEach((listener) => listener());
}

/** Client snapshot: the session, or null when signed out. */
export function getAuthSessionSnapshot(): AuthSession | null {
  if (current === undefined) {
    current = readStored();
  }

  if (current && current.expiresAt <= Date.now()) {
    current = null;
  }

  return current;
}

/** Server snapshot: undefined means "not known yet" (before hydration). */
export function getServerAuthSessionSnapshot(): AuthSession | null | undefined {
  return undefined;
}

export function subscribeToAuthSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAccessToken(): string | null {
  return getAuthSessionSnapshot()?.accessToken ?? null;
}

export function saveAuthSession(session: AuthSession) {
  current = session;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage blocked: the in-memory copy still serves this tab until it is reloaded.
  }

  notify();
}

export function clearAuthSession() {
  if (current === null) {
    return;
  }

  current = null;

  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored.
  }

  notify();
}

export function isSubmitterRole(role: AccountRole | undefined): boolean {
  return role === "Resident" || role === "Ngo" || role === "Jst";
}
