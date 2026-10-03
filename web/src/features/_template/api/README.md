# API

This folder is the frontend data layer for the feature.

Use it for code that talks to external data sources and for TanStack Query integration.

## Good examples

- fetch functions
- query key builders
- query hooks
- mutation hooks
- response mapping helpers

## Example files

- `projectKeys.ts`
- `getProject.ts`
- `useProjectQuery.ts`
- `useUpdateProjectMutation.ts`

## What belongs here

- HTTP request code
- TanStack Query setup
- cache keys
- API response handling

## What should stay out

- route files
- large UI components
- purely visual state logic

## Why this folder exists

It gives the feature one clear place for server-state concerns instead of mixing fetch logic into components.
