"use client";

import { ErrorPage } from "@/features/errors";

type ErrorProps = Readonly<{
  reset: () => void;
}>;

export default function Error({ reset }: ErrorProps) {
  return <ErrorPage onRetry={reset} />;
}
