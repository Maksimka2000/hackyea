import { Button } from "@/shared/ui/primitives/Button";
import { Surface } from "@/shared/ui/composite/Surface";

const layers = [
  {
    title: "app",
    description:
      "Next.js routing layer. Keep pages, layouts, route groups, and dynamic route entry points here.",
  },
  {
    title: "features",
    description:
      "Vertical slices for feature-specific UI, hooks, TanStack Query logic, schemas, and pure helpers.",
  },
  {
    title: "shared",
    description:
      "Reusable primitives, style tokens, providers, generic hooks, and utilities shared by multiple features.",
  },
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="section-stack animate-enter">
        <span className="eyebrow">Reusable frontend-first template</span>
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
            Next.js architecture with thin routes and reusable slices.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
            Start with the local folder README files. They define where code should live, how layers depend on each
            other, and how to keep the template lightweight for teams of one to four people.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="button">Build feature slices</Button>
          <Button type="button" variant="secondary">
            Keep route files thin
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {layers.map((layer) => (
          <Surface key={layer.title} title={layer.title}>
            {layer.description}
          </Surface>
        ))}
      </section>
    </main>
  );
}
