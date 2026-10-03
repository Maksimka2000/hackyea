import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// `border-line` is our own border-width utility (see styles/utilities.css). Without this, tailwind-merge takes it for a
// border colour and drops it whenever a real border colour class is present, which removes the border entirely.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "border-w": ["border-line"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
