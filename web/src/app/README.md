# App

Next.js App Router layer: URL structure only.

Every route lives under `[locale]` (`pl` default, `en`). The locale layout owns `<html>`, the font, the accessibility init script and providers. Route groups inside it (`(public)`, `(auth)`, `(admin)`) choose the page chrome.

## Rules

- A `page.tsx` reads params, sets the request locale, and renders one feature component.
- No UI trees, business logic, or data fetching code here.
- Feature code lives in `src/features`; reusable code in `src/shared`.
