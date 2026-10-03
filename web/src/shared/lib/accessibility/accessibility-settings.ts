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

export const ACCESSIBILITY_STORAGE_KEY = "hubmi:accessibility";

export function isTextSize(value: unknown): value is TextSize {
  return TEXT_SIZES.some((size) => size === value);
}

export function isContrastMode(value: unknown): value is ContrastMode {
  return CONTRAST_MODES.some((mode) => mode === value);
}
