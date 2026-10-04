import { RequireRole } from "@/shared/account/RequireRole";

import { MySubmissionView } from "./MySubmissionView";

type MySubmissionPageProps = Readonly<{
  id: string;
  /** True right after sending: shows the confirmation with the submission number. */
  justCreated: boolean;
}>;

export function MySubmissionPage({ id, justCreated }: MySubmissionPageProps) {
  return (
    <RequireRole role="submitter">
      <MySubmissionView id={id} justCreated={justCreated} />
    </RequireRole>
  );
}
