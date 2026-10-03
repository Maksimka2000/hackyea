import { Container } from "@/shared/ui/primitives/Container";

import { MainNavigation } from "./MainNavigation";
import { SiteBrand } from "./SiteBrand";
import { UtilityBar } from "./UtilityBar";

export function SiteHeader() {
  return (
    <header>
      <UtilityBar />
      <div className="on-dark bg-hero text-hero-foreground">
        <Container className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <SiteBrand />
          <MainNavigation />
        </Container>
      </div>
    </header>
  );
}
