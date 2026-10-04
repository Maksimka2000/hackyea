"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useRouter } from "@/i18n/navigation";

import { createCanvas, deleteCanvas, getCanvasTemplates, getMyCanvases } from "../api/canvasApi";

export function useMyCanvases() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const canvases = useQuery({ queryKey: ["canvases"], queryFn: getMyCanvases });
  const templates = useQuery({ queryKey: ["canvas-templates"], queryFn: getCanvasTemplates, staleTime: Infinity });

  const create = useMutation({
    mutationFn: createCanvas,
    onSuccess: (canvas) => router.push(`/canvas/${canvas.id}`),
  });

  const remove = useMutation({
    mutationFn: deleteCanvas,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["canvases"] }),
  });

  return {
    canvases: canvases.data,
    templates: templates.data ?? [],
    isLoading: canvases.isPending,
    isError: canvases.isError,
    create: (templateKey: string) => create.mutate(templateKey),
    isCreating: create.isPending,
    remove: (id: string) => remove.mutate(id),
  };
}
