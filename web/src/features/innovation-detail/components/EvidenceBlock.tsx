import { FlaskConical } from "lucide-react";

type EvidenceBlockProps = Readonly<{
  title: string;
  paragraphs: string[];
  missingText: string;
}>;

/** Highlighted like the evidence note on result cards, because "does it work?" is what people look for. */
export function EvidenceBlock({ missingText, paragraphs, title }: EvidenceBlockProps) {
  return (
    <section className="flex flex-col gap-3 rounded-card bg-tint p-6">
      <h2 className="flex items-center gap-3 text-2xl font-extrabold tracking-tight text-foreground">
        <FlaskConical aria-hidden="true" className="size-6 text-primary" />
        {title}
      </h2>
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p className="max-w-3xl text-lg leading-relaxed text-foreground" key={index}>
            {paragraph}
          </p>
        ))
      ) : (
        <p className="text-muted">{missingText}</p>
      )}
    </section>
  );
}
