"use client";

import { useSyncExternalStore } from "react";

import type { ContrastMode, TextSize } from "@/shared/lib/accessibility/accessibility-settings";
import {
  getAccessibilitySnapshot,
  getServerAccessibilitySnapshot,
  subscribeToAccessibilitySettings,
  updateAccessibilitySettings,
} from "@/shared/lib/accessibility/accessibility-store";

export function useAccessibilitySettings() {
  const settings = useSyncExternalStore(
    subscribeToAccessibilitySettings,
    getAccessibilitySnapshot,
    getServerAccessibilitySnapshot,
  );

  return {
    textSize: settings.textSize,
    contrast: settings.contrast,
    setTextSize: (textSize: TextSize) => updateAccessibilitySettings({ textSize }),
    setContrast: (contrast: ContrastMode) => updateAccessibilitySettings({ contrast }),
  };
}
