import { Container } from "@/shared/ui/primitives/Container";

import { MainNavigation } from "./MainNavigation";
import { MobileMenu } from "./MobileMenu";
import { SiteBrand } from "./SiteBrand";
import { UtilityBar } from "./UtilityBar";

export function SiteHeader() {
  return (
    <header>
      <UtilityBar />
      <div className="on-dark bg-hero text-hero-foreground">
        <Container className="relative z-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5">
          <SiteBrand />
          <MainNavigation />
          <MobileMenu />
        </Container>
      </div>
    </header>
  );
}
