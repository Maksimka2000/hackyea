# HubMI frontend rules

Scope: everything under `web/`. Backend rules live in `server/AGENTS.md`. Component-level guardrails are also in `web/SKILL.md`; this file adds the project-specific rules.

## Layers and dependencies

- `src/app` is routing only: pages, layouts, route groups. A `page.tsx` reads params, calls `setRequestLocale`/`resolveLocale` when needed, and renders one feature component. No UI, no logic.
- `src/features/<name>` owns a product area: `components`, `hooks`, `api`, `schemas`, `types`, `constants`, `utils`, and an `index.ts` as the only public entry. Create a subfolder only when the feature needs it.
- `src/shared` holds reusable code: `ui/primitives`, `layout` (site chrome), `hooks`, `lib`, `config`, `constants`, `styles`, `providers`.
- Allowed imports: `app -> features, shared`; `features -> shared`; `shared -> shared` (and `@/i18n`). Features never import another feature's internals; promote shared code to `shared` once two features need it.

## Routing and languages

- All routes live under `src/app/[locale]/`. Groups: `(public)` for the public site (including `/login`, the simulated Profil Zaufany sign-in), `(auth)` for staff login, `(admin)` for the staff panel.
- Sending a submission, "Moje zgłoszenia", canvases and rating need a signed-in resident, NGO or JST; wrap such UI in `RequireRole` (`shared/account`). The session (token in sessionStorage) lives in `shared/lib/auth-session.ts`; `fetchJson` attaches the token and clears the session on 401.
- The service is Polish only (`pl`): no other language and no language switcher (TASK.MD requirement). Do not add `en.json` or other locales.
- Never hardcode user-facing text. Add keys to `messages/pl.json`; keys are typed from it.
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
- Public read features switch between mock and live on their own (`apiModeFor("matching" | "innovationDetail" | "innovationList")`); signed-in features are always live: `NEXT_PUBLIC_API_MODE` is the default and `NEXT_PUBLIC_API_MODE_<FEATURE>` overrides it (see `.env.example`). Switch a feature to live only when the backend serves it. Mock fixtures live in `api/*Mock.ts` and pass through the same DTO schema as live data.
- Browser calls use the same-origin `/api` path, which `next.config.ts` proxies to `API_ORIGIN`; server components call `serverApiBaseUrl`. Frontend work does not edit `server/` by default; a small backend change is fine when the backend owner agrees to it, kept in its own commit, and backend gaps otherwise go to the backend developer as a request.
- Mark guessed endpoints and shapes as PLACEHOLDER/PROPOSED in a comment.
- Never put the user's problem description (or any free text they typed) in a URL or query string; it may contain personal details. Pass it between pages through `shared/lib/problem-session.ts`.
- Validation messages are translation keys resolved in the UI (`Validation.*` namespace for messages shared by several features).
- The matching search does not use an LLM in v1; do not build UI that assumes generated explanations.

## Hygiene

- Dependencies are pinned to exact versions in `package.json`. Update them deliberately, not with `latest`.
- Run `npm run typecheck` and `npm run lint` before committing; both must be clean.
- Do not commit `.next/`, `node_modules/`, or `.env*` files other than `.env.example`.
- Preserve a teammate's uncommitted work. Coordinate edits to shared files: `tokens.css`, `messages/*.json`, `package.json`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
