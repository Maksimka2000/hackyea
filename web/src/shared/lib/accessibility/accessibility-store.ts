import {
  ACCESSIBILITY_STORAGE_KEY,
  DEFAULT_ACCESSIBILITY_SETTINGS,
  isContrastMode,
  isTextSize,
  type AccessibilitySettings,
} from "./accessibility-settings";

/*
  Tiny external store for text size and contrast mode.
  The <html> data attributes are the source of truth (CSS reads them), localStorage persists them,
  and React reads them through useSyncExternalStore (see useAccessibilitySettings).
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
  try {
    window.localStorage.setItem(ACCESSIBILITY_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Storage can be blocked (private mode); the settings still apply for this visit.
  }
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
