"use client";

import { useEffect, useRef, useState } from "react";

const RESET_AFTER_MS = 2500;

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      if (timer.current) {
        clearTimeout(timer.current);
      }

      timer.current = setTimeout(() => setCopied(false), RESET_AFTER_MS);
    } catch {
      // Clipboard access can be denied; the link stays visible on the page for manual copying.
      setCopied(false);
    }
  };

  return { copied, copy };
}
