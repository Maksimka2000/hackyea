import { RequireRole } from "@/shared/account/RequireRole";

import { CanvasEditor } from "./CanvasEditor";

type CanvasEditorPageProps = Readonly<{
  id: string;
}>;

export function CanvasEditorPage({ id }: CanvasEditorPageProps) {
  return (
    <RequireRole role="submitter">
      <CanvasEditor id={id} />
    </RequireRole>
  );
}
