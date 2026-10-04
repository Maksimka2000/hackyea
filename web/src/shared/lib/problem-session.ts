/*
  Hands the problem text from the home form to the results page without putting it in the URL
  (people may type personal details; query strings end up in history and server logs).
  Lives for the browser tab only (sessionStorage), with an in-memory copy if storage is blocked.
*/
const STORAGE_KEY = "hubmi:problem";

const listeners = new Set<() => void>();
let current: string | null | undefined;

function readStored(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Client snapshot: the saved text, or null when nothing was saved yet. */
export function getProblemSessionSnapshot(): string | null | undefined {
  if (current === undefined) {
    current = readStored();
  }

  return current;
}

/** Server snapshot: undefined means "not known yet" (before hydration). */
export function getServerProblemSessionSnapshot(): string | null | undefined {
  return undefined;
}

export function subscribeToProblemSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function saveProblemText(text: string) {
  current = text;

  try {
    window.sessionStorage.setItem(STORAGE_KEY, text);
  } catch {
    // Storage blocked: the in-memory copy still serves this page view.
  }

  listeners.forEach((listener) => listener());
}

/*
  The ids of the library cards shown for the last search (ids only, never text). A need submitted afterwards sends them,
  so ROPS sees which cards the person already looked at ("oglądane przy wyszukiwaniu").
*/
const SEEN_STORAGE_KEY = "hubmi:seen-innovations";
const MAX_SEEN = 10;

export function saveSeenInnovations(ids: readonly string[]) {
  try {
    window.sessionStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(ids.slice(0, MAX_SEEN)));
  } catch {
    // Storage blocked: the submission is simply sent without these links.
  }
}

export function getSeenInnovations(): string[] {
  try {
    const parsed: unknown = JSON.parse(window.sessionStorage.getItem(SEEN_STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string").slice(0, MAX_SEEN) : [];
  } catch {
    return [];
  }
}
