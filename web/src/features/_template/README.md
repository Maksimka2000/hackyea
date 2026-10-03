# Feature Template

Copy this folder when you create a new feature and rename it to the feature name.

Example:

- `src/features/_template`
- becomes `src/features/project`

## Goal of a feature folder

A feature folder should contain almost everything needed for one product area.

This keeps code related to the same business problem close together.

## Suggested mental model

- `components` renders the feature UI
- `hooks` coordinates feature behavior
- `context` stores feature-local React Context when deep sharing is needed
- `api` talks to external data and TanStack Query
- `schemas` validates boundary data
- `types` holds internal TypeScript-only shapes
- `constants` holds feature-only static values
- `utils` holds pure feature helpers
- `index.ts` is the public entry point for the feature

## Example

For a `project` feature, you might have:

- `components/ProjectDetails.tsx`
- `hooks/useProjectFilters.ts`
- `context/ProjectFiltersContext.tsx`
- `api/useProjectQuery.ts`
- `schemas/projectSchema.ts`
- `types/project-row.ts`
- `constants/project-status-options.ts`
- `utils/mapProjectToRow.ts`

## Important rules

- keep code local to the feature by default
- move code to `shared` only after real reuse appears
- do not put route files here
- avoid exposing many internal files directly to the rest of the app

## About `index.ts`

Use `index.ts` as the public surface of the feature when possible.

That gives other parts of the app one clear import point instead of many deep imports.
