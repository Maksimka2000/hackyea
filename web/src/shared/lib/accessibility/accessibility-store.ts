import {
  ACCESSIBILITY_COOKIE,
  ACCESSIBILITY_COOKIE_MAX_AGE_SECONDS,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  isContrastMode,
  isTextSize,
  type AccessibilitySettings,
} from "./accessibility-settings";

/*
  Tiny external store for text size and contrast mode.
  The <html> data attributes are the source of truth (CSS reads them), a cookie persists them (the server
  renders the attributes from it on the first paint), and React reads them through useSyncExternalStore.
*/

const listeners = new Set<() => void>();
let snapshot: AccessibilitySettings | null = null;

function readFromDocument(): AccessibilitySettings {
  const { textSize, contrast } = document.documentElement.dataset;

  return {
    textSize: isTextSize(textSize) ? textSize : DEFAULT_ACCESSIBILITY_SETTINGS.textSize,
    contrast: isContrastMode(contrast) ? contrast : DEFAULT_ACCESSIBILITY_SETTINGS.contrast,
  };
}

function persist(settings: AccessibilitySettings) {
  const value = encodeURIComponent(JSON.stringify(settings));
  document.cookie = `${ACCESSIBILITY_COOKIE}=${value}; path=/; max-age=${ACCESSIBILITY_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

export function getServerAccessibilitySnapshot(): AccessibilitySettings {
  return DEFAULT_ACCESSIBILITY_SETTINGS;
}

export function getAccessibilitySnapshot(): AccessibilitySettings {
  snapshot ??= readFromDocument();
  return snapshot;
}

export function subscribeToAccessibilitySettings(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateAccessibilitySettings(patch: Partial<AccessibilitySettings>) {
  const next = { ...getAccessibilitySnapshot(), ...patch };

  document.documentElement.dataset.textSize = next.textSize;
  document.documentElement.dataset.contrast = next.contrast;
  snapshot = next;
  persist(next);
  listeners.forEach((listener) => listener());
}
