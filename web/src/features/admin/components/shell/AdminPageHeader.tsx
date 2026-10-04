import type { ReactNode } from "react";

type AdminPageHeaderProps = Readonly<{
  title: string;
  lead?: string;
  actions?: ReactNode;
}>;

export function AdminPageHeader({ actions, lead, title }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{title}</h1>
        {lead ? <p className="mt-1 max-w-3xl text-muted">{lead}</p> : null}
      </div>
      {actions}
    </div>
  );
}
