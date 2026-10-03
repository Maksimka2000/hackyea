import type { MatchResult } from "../types/match-result";

import { MatchCard } from "./MatchCard";

type ResultListProps = Readonly<{
  items: MatchResult[];
}>;

export function ResultList({ items }: ResultListProps) {
  return (
    <ol className="flex flex-col gap-6">
      {items.map((item) => (
        <li key={item.id}>
          <MatchCard result={item} />
        </li>
      ))}
    </ol>
  );
}
