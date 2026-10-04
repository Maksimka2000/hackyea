"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { Container } from "@/shared/ui/primitives/Container";
import { Skeleton } from "@/shared/ui/primitives/Skeleton";

import { useCanvasEditor } from "../hooks/useCanvasEditor";
import type { PlanContent } from "../types/canvas";

import { AmountBoard } from "./AmountBoard";
import { BoardCard } from "./BoardCard";
import { CanvasToolbar } from "./CanvasToolbar";
import { CanvasWarnings } from "./CanvasWarnings";
import { PlanBoard } from "./PlanBoard";
import { SubmitCanvasPanel } from "./SubmitCanvasPanel";
import { TextBoard } from "./TextBoard";

type CanvasEditorProps = Readonly<{
  id: string;
}>;

/** The boards of the canvas, one card each, saved automatically. */
export function CanvasEditor({ id }: CanvasEditorProps) {
  const t = useTranslations("Canvas.editor");
  const editor = useCanvasEditor(id);

  if (editor.isLoading) {
    return (
      <Container className="py-12">
        <Skeleton className="h-96" />
      </Container>
    );
  }

  if (editor.isError || !editor.canvas || !editor.template) {
    return (
      <Container className="py-16">
        <p className="text-lg text-danger" role="alert">
          {t("loadError")}
        </p>
      </Container>
    );
  }

  const submitted = editor.canvas.submissionId !== null;

  return (
    <Container className="flex flex-col gap-6 py-8">
      <Link className="inline-flex items-center gap-2 font-semibold text-primary underline" href="/canvas">
        <ArrowLeft aria-hidden="true" className="size-4" />
        {t("back")}
      </Link>
      <CanvasToolbar
        onTitleChange={editor.setTitle}
        saveError={editor.saveError}
        saveState={editor.saveState}
        templateTitle={editor.template.title}
        title={editor.title}
      />
      <CanvasWarnings warnings={editor.warnings} />
      <div className="grid gap-6 lg:grid-cols-2">
        {editor.template.boards.map((board) => (
          <BoardCard board={board} key={board.key} wide={board.type === "plan" || (board.maxLength ?? 0) > 3000}>
            {board.type === "plan" ? (
              <PlanBoard board={board} onChange={(value) => editor.setAnswer(board.key, value)} value={editor.content[board.key] as PlanContent | undefined} />
            ) : board.type === "amount" ? (
              <AmountBoard
                board={board}
                onChange={(value) => editor.setAnswer(board.key, value)}
                plan={Object.values(editor.content).find((value): value is PlanContent => typeof value === "object" && value !== null)}
                value={typeof editor.content[board.key] === "number" ? (editor.content[board.key] as number) : null}
              />
            ) : (
              <TextBoard
                board={board}
                onChange={(value) => editor.setAnswer(board.key, value)}
                value={typeof editor.content[board.key] === "string" ? (editor.content[board.key] as string) : ""}
              />
            )}
          </BoardCard>
        ))}
      </div>
      {/* Room for improvement: during a grant call, a call-specific application generator would start from this canvas here. */}
      <SubmitCanvasPanel error={editor.submitError} isSubmitting={editor.isSubmitting} onSubmit={editor.submit} submissionId={editor.canvas.submissionId} submitted={submitted} />
    </Container>
  );
}
