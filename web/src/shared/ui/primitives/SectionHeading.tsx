type SectionHeadingProps = Readonly<{
  id: string;
  title: string;
  description?: string;
}>;

export function SectionHeading({ id, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-8 flex flex-col gap-2">
      <h2 className="text-3xl font-extrabold tracking-tight text-foreground" id={id}>
        {title}
      </h2>
      {description ? <p className="max-w-2xl text-muted">{description}</p> : null}
    </div>
  );
}
