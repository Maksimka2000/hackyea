import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Container } from "@/shared/ui/primitives/Container";

type StatusPageProps = Readonly<{
  icon: LucideIcon;
  title: string;
  text: string;
  /** The buttons or links offered to get the visitor going again. */
  children: ReactNode;
}>;

export function StatusPage({ children, icon: Icon, text, title }: StatusPageProps) {
  return (
    <Container className="flex flex-col items-start gap-4 py-20">
      <Icon aria-hidden="true" className="size-12 text-primary" />
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
      <p className="max-w-xl text-lg text-muted">{text}</p>
      <div className="flex flex-wrap gap-3">{children}</div>
    </Container>
  );
}
