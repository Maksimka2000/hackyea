"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { serverMessage } from "@/shared/lib/api-error";

import { getCanvas, getCanvasTemplates, saveCanvas, submitCanvas } from "../api/canvasApi";
import type { Canvas, CanvasContent, CanvasWarning, SaveState } from "../types/canvas";

const AUTOSAVE_DELAY_MS = 1200;

/**
 * The canvas being edited: local answers saved automatically shortly after the last change.
 * Warnings come back from each save; sending turns the canvas into an idea submission.
 */
export function useCanvasEditor(id: string) {
  const router = useRouter();
  const canvasQuery = useQuery({ queryKey: ["canvas", id], queryFn: () => getCanvas(id), refetchOnWindowFocus: false, staleTime: Infinity });
  const templatesQuery = useQuery({ queryKey: ["canvas-templates"], queryFn: getCanvasTemplates, staleTime: Infinity });

  // Local edits; until the first edit the loaded canvas is shown as is.
  const [draft, setDraft] = useState<{ title: string; content: CanvasContent } | null>(null);
  const [savedWarnings, setWarnings] = useState<CanvasWarning[] | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | undefined>();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loaded = canvasQuery.data;
  const current = draft ?? (loaded ? { title: loaded.title, content: loaded.content } : null);

  const persist = useCallback(
    async (next: { title: string; content: CanvasContent }) => {
      setSaveState("saving");
      try {
        const saved: Canvas = await saveCanvas(id, next.title.trim() || "—", next.content);
        setWarnings(saved.warnings);
        setSaveState("saved");
        setSaveError(undefined);
      } catch (error) {
        setSaveState("error");
        setSaveError(serverMessage(error));
      }
    },
    [id],
  );

  const schedule = (next: { title: string; content: CanvasContent }) => {
    setDraft(next);
    setSaveState("idle");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void persist(next), AUTOSAVE_DELAY_MS);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const submit = useMutation({
    mutationFn: async () => {
      if (timer.current && current) {
        clearTimeout(timer.current);
        await persist(current);
      }
      return submitCanvas(id);
    },
    onSuccess: (created) => router.push(`/my-submissions/${created.id}?created=1`),
  });

  const template = templatesQuery.data?.find((item) => item.key === loaded?.templateKey);

  return {
    isLoading: canvasQuery.isPending || templatesQuery.isPending,
    isError: canvasQuery.isError || templatesQuery.isError,
    template,
    canvas: loaded,
    title: current?.title ?? "",
    content: current?.content ?? {},
    setTitle: (title: string) => current && schedule({ ...current, title }),
    setAnswer: (board: string, value: CanvasContent[string]) =>
      current && schedule({ ...current, content: { ...current.content, [board]: value } }),
    warnings: savedWarnings ?? loaded?.warnings ?? [],
    saveState,
    saveError,
    submit: () => submit.mutate(),
    isSubmitting: submit.isPending || submit.isSuccess,
    submitError: submit.isError ? (serverMessage(submit.error) ?? "generic") : undefined,
  };
}
