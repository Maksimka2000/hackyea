"use client";

import { useQuery } from "@tanstack/react-query";

import { getDemoAccounts } from "../api/authApi";

export function useDemoAccounts() {
  return useQuery({ queryKey: ["auth", "demo-accounts"], queryFn: getDemoAccounts, staleTime: Infinity }).data ?? [];
}
