export const TEXT_SIZES = ["md", "lg", "xl"] as const;
export const CONTRAST_MODES = ["normal", "high"] as const;

export type TextSize = (typeof TEXT_SIZES)[number];
export type ContrastMode = (typeof CONTRAST_MODES)[number];

export type AccessibilitySettings = {
  textSize: TextSize;
  contrast: ContrastMode;
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  textSize: "md",
  contrast: "normal",
};

/** Cookie (not localStorage) so the server can render the right text size and contrast on the first paint. */
export const ACCESSIBILITY_COOKIE = "hubmi-accessibility";
export const ACCESSIBILITY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isTextSize(value: unknown): value is TextSize {
  return TEXT_SIZES.some((size) => size === value);
}

export function isContrastMode(value: unknown): value is ContrastMode {
  return CONTRAST_MODES.some((mode) => mode === value);
}

/** Reads the cookie value defensively; anything unexpected falls back to the defaults. */
export function parseAccessibilitySettings(raw: string | undefined): AccessibilitySettings {
  if (!raw) {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }

  try {
    const parsed: unknown = JSON.parse(raw);
    const { textSize, contrast } = (parsed ?? {}) as Record<string, unknown>;

    return {
      textSize: isTextSize(textSize) ? textSize : DEFAULT_ACCESSIBILITY_SETTINGS.textSize,
      contrast: isContrastMode(contrast) ? contrast : DEFAULT_ACCESSIBILITY_SETTINGS.contrast,
    };
  } catch {
    return DEFAULT_ACCESSIBILITY_SETTINGS;
  }
}
