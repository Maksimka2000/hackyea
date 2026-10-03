"use client";

import { useState } from "react";

/** Tracks whether the preview image loaded; a failed image is hidden so no broken picture shows. */
export function useVideoThumbnail() {
  const [hasFailed, setHasFailed] = useState(false);

  return { isVisible: !hasFailed, onError: () => setHasFailed(true) };
}
