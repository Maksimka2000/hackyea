import { Container } from "@/shared/ui/primitives/Container";

import { SearchHeader } from "./SearchHeader";
import { SearchResults } from "./SearchResults";
import { SearchSidebar } from "./SearchSidebar";

/*
  Two columns on desktop, one normal page scroll for both. The results come first in the DOM (main content
  first for screen readers); the grid puts the sidebar on the left. On mobile the results stay on top.
*/
export function SearchPage() {
  return (
    <>
      <SearchHeader />
      <Container className="mt-8 grid gap-8 lg:grid-cols-[22rem_1fr] lg:items-start">
        <div className="lg:col-start-2 lg:row-start-1">
          <SearchResults />
        </div>
        <div className="lg:col-start-1 lg:row-start-1">
          <SearchSidebar />
        </div>
      </Container>
    </>
  );
}
