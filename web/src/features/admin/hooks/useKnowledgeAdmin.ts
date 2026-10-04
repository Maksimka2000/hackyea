"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { serverMessage } from "@/shared/lib/api-error";

import {
  changePublication,
  deleteKnowledgeItem,
  getAdminChallenges,
  getAdminInnovations,
  getAdminMaterials,
  saveChallenge,
  saveMaterial,
  type PublicationStep,
} from "../api/adminApi";

type Kind = "innovations" | "challenges" | "materials";

/** Verify / publish / unpublish / delete for any knowledge item, refreshing the matching list afterwards. */
export function usePublicationActions(kind: Kind) {
  const queryClient = useQueryClient();
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", kind] });

  const step = useMutation({ mutationFn: ({ id, step }: { id: string; step: PublicationStep }) => changePublication(kind, id, step), onSuccess: refresh });
  const remove = useMutation({ mutationFn: (id: string) => deleteKnowledgeItem(kind, id), onSuccess: refresh });
  const failure = step.error ?? remove.error;

  return {
    run: (id: string, value: PublicationStep) => step.mutate({ id, step: value }),
    remove: (id: string) => remove.mutate(id),
    isPending: step.isPending || remove.isPending,
    error: step.isError || remove.isError ? (serverMessage(failure) ?? "generic") : undefined,
  };
}

export function useAdminInnovationList() {
  const [filter, setFilter] = useState<{ status?: string; q?: string }>({});
  const query = useQuery({ queryKey: ["admin", "innovations", filter], queryFn: () => getAdminInnovations(filter) });
  return { filter, setFilter, query };
}

export function useAdminChallenges() {
  return useEditableList("challenges", getAdminChallenges, saveChallenge);
}

export function useAdminMaterials() {
  return useEditableList("materials", getAdminMaterials, saveMaterial);
}

function useEditableList<T>(kind: Kind, load: () => Promise<T[]>, save: (id: string | null, body: Record<string, string>) => Promise<unknown>) {
  const queryClient = useQueryClient();
  const query = useQuery({ queryKey: ["admin", kind], queryFn: load });
  const mutation = useMutation({
    mutationFn: ({ body, id }: { id: string | null; body: Record<string, string> }) => save(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", kind] }),
  });

  return {
    query,
    save: async (id: string | null, body: Record<string, string>) => {
      try {
        await mutation.mutateAsync({ id, body });
        return true;
      } catch {
        return false;
      }
    },
    isSaving: mutation.isPending,
    saveError: mutation.isError ? (serverMessage(mutation.error) ?? "generic") : undefined,
  };
}
