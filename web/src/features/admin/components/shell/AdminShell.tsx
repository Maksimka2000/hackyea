import type { ReactNode } from "react";

import { RequireRole } from "@/shared/account/RequireRole";
import { MAIN_CONTENT_ID } from "@/shared/constants/layout";
import { SkipLink } from "@/shared/layout/SkipLink";

import { AdminHeader } from "./AdminHeader";
import { AdminNavigation } from "./AdminNavigation";

type AdminShellProps = Readonly<{
  children: ReactNode;
}>;

/** Staff panel chrome: its own header and navigation; every page inside needs a ROPS staff account. */
export function AdminShell({ children }: AdminShellProps) {
  return (
    <>
      <SkipLink />
      <AdminHeader />
      <RequireRole role="admin">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[14rem_1fr]">
          <AdminNavigation />
          <main className="min-w-0" id={MAIN_CONTENT_ID}>
            {children}
          </main>
        </div>
      </RequireRole>
    </>
  );
}
