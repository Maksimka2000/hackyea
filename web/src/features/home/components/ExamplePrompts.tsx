import { useTranslations } from "next-intl";

import { Chip } from "@/shared/ui/primitives/Chip";

import { examplePromptKeys } from "../constants/example-prompt-keys";

type ExamplePromptsProps = Readonly<{
  onSelect: (text: string) => void;
}>;

export function ExamplePrompts({ onSelect }: ExamplePromptsProps) {
  const t = useTranslations("Home.search");

  return (
    <div>
      <p className="mb-2 text-sm font-bold text-foreground">{t("examplesTitle")}</p>
      <ul className="flex flex-col gap-2">
        {examplePromptKeys.map((key) => (
          <li className="flex" key={key}>
            <Chip className="w-full" onClick={() => onSelect(t(`examples.${key}`))}>
              {t(`examples.${key}`)}
            </Chip>
          </li>
        ))}
      </ul>
    </div>
  );
}
