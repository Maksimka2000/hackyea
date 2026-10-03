"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type AppShellContextValue = {
  isNavigationOpen: boolean;
  closeNavigation: () => void;
  openNavigation: () => void;
  toggleNavigation: () => void;
};

const AppShellContext = createContext<AppShellContextValue | null>(null);

type AppShellContextProviderProps = Readonly<{
  children: ReactNode;
}>;

export function AppShellContextProvider({ children }: AppShellContextProviderProps) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  const value: AppShellContextValue = {
    isNavigationOpen,
    closeNavigation: () => setIsNavigationOpen(false),
    openNavigation: () => setIsNavigationOpen(true),
    toggleNavigation: () => setIsNavigationOpen((currentValue) => !currentValue),
  };

  return <AppShellContext.Provider value={value}>{children}</AppShellContext.Provider>;
}

export function useAppShellContext() {
  const context = useContext(AppShellContext);

  if (!context) {
    throw new Error("useAppShellContext must be used inside AppShellContextProvider.");
  }

  return context;
}
