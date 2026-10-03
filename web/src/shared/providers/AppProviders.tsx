"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { createQueryClient } from "@/shared/lib/query-client";
import { AppShellContextProvider } from "@/shared/contexts/AppShellContext";

type AppProvidersProps = Readonly<{
  children: ReactNode;
}>;

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AppShellContextProvider>{children}</AppShellContextProvider>
    </QueryClientProvider>
  );
}
