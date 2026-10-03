import { Container } from "@/shared/ui/primitives/Container";

import { AccessibilityControls } from "./AccessibilityControls";

export function UtilityBar() {
  return (
    <div className="on-dark border-line border-x-0 border-t-0 border-hero-foreground/15 bg-hero-deep text-hero-foreground">
      <Container className="flex justify-center py-2 sm:justify-end">
        <AccessibilityControls />
      </Container>
    </div>
  );
}
