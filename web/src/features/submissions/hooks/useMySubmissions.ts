"use client";

import { useQuery } from "@tanstack/react-query";

import { getMySubmissions } from "../api/mySubmissionsApi";
import { mySubmissionKeys } from "./mySubmissionKeys";

export function useMySubmissions() {
  return useQuery({ queryKey: mySubmissionKeys.all, queryFn: getMySubmissions });
}
