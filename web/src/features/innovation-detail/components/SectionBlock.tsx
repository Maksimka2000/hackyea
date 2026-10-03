type SectionBlockProps = Readonly<{
  title: string;
  paragraphs: string[];
  missingText: string;
}>;

export function SectionBlock({ missingText, paragraphs, title }: SectionBlockProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
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
