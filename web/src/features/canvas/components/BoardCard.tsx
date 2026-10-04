import type { ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui/primitives/Card";

import type { CanvasBoard } from "../types/canvas";

type BoardCardProps = Readonly<{
  board: CanvasBoard;
  wide: boolean;
  children: ReactNode;
}>;

/** One board: its number from the call form, the title, the guiding questions, then the answer. */
export function BoardCard({ board, children, wide }: BoardCardProps) {
  const headingId = `board-${board.key}-title`;

  return (
    <section aria-labelledby={headingId} className={cn(wide && "lg:col-span-2")}>
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 flex-none place-items-center rounded-control bg-primary font-extrabold text-primary-foreground"
          >
            {board.number}
          </span>
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-bold text-foreground" id={headingId}>
              {board.title}
            </h2>
            {board.hint ? <p className="text-sm text-muted">{board.hint}</p> : null}
          </div>
        </div>
        <ul className="list-disc pl-5 text-sm text-foreground">
          {board.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ul>
        {children}
      </Card>
    </section>
  );
}
