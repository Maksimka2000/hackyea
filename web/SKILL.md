---
name: frontend-component-guardrails
description: Enforce frontend React component implementation standards for newly written or currently modified code only. Use when creating new UI components, updating component files in the current task, or adding hooks/utilities for UI behavior. Do not refactor untouched legacy code unless explicitly requested.
---

# Frontend Component Guardrails

Apply these rules only to new code and files/components edited in the current task. Do not rewrite untouched legacy code unless the user explicitly asks.

## 0. Component Placement
- Feature-specific components should live under `featurename/components/`.
- Nesting inside `/components/` is allowed when it improves structure (for example grouped subcomponents).
- Keep page files in `/app/**/page.tsx` very thin: no business logic and no UI implementation there; treat them primarily as route entry points.

## 1. Keep Components Thin
- Keep components rendering-focused.
- Do not embed business logic, API calls, or complex state orchestration in component bodies.
- Split components when they grow beyond ~100-150 lines.
- Export one component per file.

## 2. Extract Logic to Hooks/Utils
- Put side effects (fetching, mutations, timers, subscriptions) in custom hooks.
- Route non-trivial event handlers through hook functions.
- Move derived values and transformations to hooks or utilities.

## 3. Compose from UI Primitives
- Reuse shared primitives/composites first (`Button`, `Input`, `Card`, `Spinner`, `Alert`, etc.).
- Do not reimplement common UI patterns if an atom exists.
- Create new primitives only when a pattern repeats across 2+ features.

## 4. Use Design Tokens
- Do not hardcode hex colors, random pixel magic numbers, or ad-hoc visual values in JSX.
- Use Tailwind theme tokens / semantic classes (`text-muted-foreground`, `bg-primary/10`, `rounded-lg`, etc.).
- Keep spacing, shadows, radii, and colors aligned with the design system.

## 5. Keep Props Explicit and Clear
- Define explicit `interface`/`type` for props.
- Use descriptive prop names.
- Prefer composition (`children`, render patterns) over deep config objects.
- Declare defaults in parameter destructuring.

## 6. Preserve Accessibility
- Add appropriate `aria-*` attributes when needed.
- Preserve keyboard support and focus visibility.

## 7. Keep Styling Consistent
- Order classes logically: layout -> spacing -> sizing -> colors -> effects.
- Extract repeated class sets into constants/utilities.
- Prefer design-system timing variables where available.

## 8. Maintain Type Safety
- Avoid `any`.
- Use shared types from central `types` locations or feature-local types.
- Extend standard HTML attributes where relevant (for example `React.ButtonHTMLAttributes<HTMLButtonElement>`).

## 9. Follow Naming Conventions
- Components: PascalCase and descriptive (for example `AuthHeader`).
- File name matches component name exactly (for example `AuthHeader.tsx`).
- Hooks use `use` prefix.

## 10. Respect Separation of Concerns
- Components render UI.
- Hooks manage side effects/state.
- Utilities transform data.
- Components should receive data via props instead of fetching directly.
