"use client";

import { useTranslations } from "next-intl";

import { Textarea } from "@/shared/ui/primitives/Textarea";

import type { CanvasBoard } from "../types/canvas";

type TextBoardProps = Readonly<{
  board: CanvasBoard;
  value: string;
  onChange: (value: string) => void;
}>;

export function TextBoard({ board, onChange, value }: TextBoardProps) {
  const t = useTranslations("Canvas.editor");
  const id = `board-${board.key}`;

  return (
    <div className="flex flex-col gap-1">
      <label className="sr-only" htmlFor={id}>
        {board.title}
      </label>
      <Textarea
        aria-describedby={`${id}-counter`}
        className={board.key === "title" ? "min-h-16" : "min-h-40"}
        id={id}
        maxLength={board.maxLength ?? undefined}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
      {board.maxLength ? (
        <p className="text-right text-sm text-muted" id={`${id}-counter`}>
          {t("counter", { count: value.length, max: board.maxLength })}
        </p>
      ) : null}
    </div>
  );
}
