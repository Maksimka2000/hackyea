import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AdminShell } from "@/features/admin";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type AdminLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShell>{children}</AdminShell>;
}
