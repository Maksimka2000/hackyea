import { ButtonLink } from "@/shared/ui/primitives/ButtonLink";
import { Card } from "@/shared/ui/primitives/Card";

type CalloutCardProps = Readonly<{
  title: string;
  text: string;
  href: string;
  ctaLabel: string;
}>;

/** Small tinted card with a heading, one sentence and a single call to action. */
export function CalloutCard({ ctaLabel, href, text, title }: CalloutCardProps) {
  return (
    <Card className="flex flex-col items-start gap-3 bg-tint p-5">
      <h2 className="text-lg font-bold text-foreground">{title}</h2>
      <p className="text-sm text-muted">{text}</p>
      <ButtonLink href={href} variant="outline">
        {ctaLabel}
      </ButtonLink>
    </Card>
  );
}
