# HubMI frontend rules

Scope: everything under `web/`. Backend rules live in `server/AGENTS.md`. Component-level guardrails are also in `web/SKILL.md`; this file adds the project-specific rules.

## Layers and dependencies

- `src/app` is routing only: pages, layouts, route groups. A `page.tsx` reads params, calls `setRequestLocale`/`resolveLocale` when needed, and renders one feature component. No UI, no logic.
- `src/features/<name>` owns a product area: `components`, `hooks`, `api`, `schemas`, `types`, `constants`, `utils`, and an `index.ts` as the only public entry. Create a subfolder only when the feature needs it.
- `src/shared` holds reusable code: `ui/primitives`, `layout` (site chrome), `hooks`, `lib`, `config`, `constants`, `styles`, `providers`.
- Allowed imports: `app -> features, shared`; `features -> shared`; `shared -> shared` (and `@/i18n`). Features never import another feature's internals; promote shared code to `shared` once two features need it.

## Routing and languages

- All routes live under `src/app/[locale]/`. Groups: `(public)` for the public site, `(auth)` for admin login, `(admin)` for the staff panel.
- Polish (`pl`) is the primary language and default; English (`en`) is secondary. Locale detection is off on purpose.
- Never hardcode user-facing text. Add keys to `messages/pl.json` first, then mirror them in `messages/en.json` with the same structure. Keys are typed from `pl.json`.
- Links between pages use `Link`/`ButtonLink` from `@/i18n/navigation`, never `next/link`.
- Seeded content (innovations, resources) comes from the API in Polish only.

## Components

- One component per file; file name equals the component name. Split at roughly 100-150 lines.
- Components render. Side effects, form state, and event orchestration go in hooks (`useXxx`). Data transformation goes in `utils`. Components receive data through props and never call the API themselves.
- Async server components fetch through the feature's `api` function and pass results down as props.
- Compose from `shared/ui/primitives` first. Create a new primitive only when a pattern repeats across features.
- Add `"use client"` only to components that need state, effects, or browser APIs.

## Styling and design tokens

- Use semantic token classes only: `bg-primary`, `text-muted`, `border-border`, `rounded-card`, `shadow-card`. Never hardcode hex colours, pixel values, or ad-hoc shadows in JSX.
- Tokens live in `shared/styles/tokens.css`. Changing a colour or radius happens there.
- Use `border-line` (not `border`) for borders so high-contrast mode thickens them. Use `on-dark` on dark surfaces so the focus ring stays visible. Use `contrast-high:` to hide decoration in high contrast.
- Use `rem`-based sizes (Tailwind defaults) so the three text sizes scale the whole page. Avoid fixed `px` font sizes.
- Order classes: layout, spacing, sizing, colour, effects.

## Accessibility (a real requirement, WCAG 2.1 AA)

- Text size (`data-text-size`) and contrast (`data-contrast`) are set on `<html>` by `shared/lib/accessibility`, read through `useAccessibilitySettings`. Do not duplicate this state elsewhere.
- Every interactive element is keyboard reachable with a visible focus ring. Never remove outlines.
- Every input has a visible `<label>`; errors use `role="alert"` and `aria-invalid`; status updates use `role="status"`.
- Colour is never the only signal (pair it with text or an icon). Meet 4.5:1 text contrast in both modes.
- Decorative images and icons are `aria-hidden`. Meaningful images need `alt` text.
- Links that repeat ("Zobacz rozwiązanie") must include the target name for screen readers.

## Data and API contract

- The backend contract is not final. Each feature keeps three separate layers: DTO schema (`schemas/*DtoSchema.ts`, mirrors the server), mapper (`utils/map*.ts`), and a view-model type (`types/`). Components only see view models.
- When the real contract changes, edit the DTO schema and mapper. Do not change components for a renamed field.
- `NEXT_PUBLIC_API_MODE=mock` (default) serves fixtures from `api/*Mock.ts`, parsed through the same DTO schema as live data. `live` calls the backend through `NEXT_PUBLIC_API_BASE_URL`.
- Mark guessed endpoints and shapes as PLACEHOLDER/PROPOSED in a comment.

## Hygiene

- Dependencies are pinned to exact versions in `package.json`. Update them deliberately, not with `latest`.
- Run `npm run typecheck` and `npm run lint` before committing; both must be clean.
- Do not commit `.next/`, `node_modules/`, or `.env*` files other than `.env.example`.
- Preserve a teammate's uncommitted work. Coordinate edits to shared files: `tokens.css`, `messages/*.json`, `package.json`.
