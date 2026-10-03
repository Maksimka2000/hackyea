import type { ReactNode } from "react";

import { MAIN_CONTENT_ID } from "@/shared/constants/layout";
import { SiteFooter } from "@/shared/layout/SiteFooter";
import { SiteHeader } from "@/shared/layout/SiteHeader";
import { SkipLink } from "@/shared/layout/SkipLink";

type PublicLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id={MAIN_CONTENT_ID}>{children}</main>
      <SiteFooter />
    </>
  );
}
