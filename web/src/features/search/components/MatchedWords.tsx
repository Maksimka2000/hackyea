import { useTranslations } from "next-intl";

const MAX_WORDS = 4;

type MatchedWordsProps = Readonly<{
  words: string[];
}>;

/** The words from the user's description that were found in the card. Hidden when there are none. */
export function MatchedWords({ words }: MatchedWordsProps) {
  const t = useTranslations("Search.card");

  if (words.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-semibold text-muted">{t("matchedWords")}</span>
      <ul className="flex flex-wrap gap-2">
        {words.slice(0, MAX_WORDS).map((word) => (
          <li className="border-line rounded-full border-border-strong px-3 py-0.5 font-semibold text-foreground" key={word}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
}
