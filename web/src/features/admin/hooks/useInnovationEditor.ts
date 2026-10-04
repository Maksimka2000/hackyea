"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";
import { ApiError, serverMessage } from "@/shared/lib/api-error";

import { createInnovation, getAdminInnovation, updateInnovation } from "../api/adminApi";

export const innovationFields = [
  "title",
  "categoryId",
  "tagline",
  "problems",
  "solution",
  "targetGroup",
  "beneficiaries",
  "evidence",
  "sourceUrl",
  "videoUrl",
  "materialsUrl",
  "detailsPdfUrl",
  "licenseUrl",
  "disseminationBadge",
] as const;

export type InnovationField = (typeof innovationFields)[number];
export type InnovationFormValues = Record<InnovationField, string>;

/** Loads a card for editing (or starts a new draft) and saves it; field errors come from the server. */
export function useInnovationEditor(id: string | null) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["admin", "innovations", "one", id], queryFn: () => getAdminInnovation(id!), enabled: id !== null });

  const save = useMutation({
    mutationFn: async (values: InnovationFormValues) => {
      if (id) {
        await updateInnovation(id, values);
        return id;
      }
      return (await createInnovation(values)).id;
    },
    onSuccess: (savedId) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "innovations"] });
      if (!id) router.replace(`/admin/knowledge/innovations/${savedId}`);
    },
  });

  const fieldErrors = save.error instanceof ApiError ? (save.error.problem?.errors ?? {}) : {};

  return {
    innovation: query.data,
    isLoading: id !== null && query.isPending,
    isError: query.isError,
    save: (values: InnovationFormValues) => save.mutate(values),
    isSaving: save.isPending,
    saved: save.isSuccess,
    fieldError: (field: InnovationField) => fieldErrors[field]?.[0],
    saveError: save.isError ? (serverMessage(save.error) ?? "generic") : undefined,
  };
}
