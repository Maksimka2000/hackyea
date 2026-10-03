# Next.js Frontend Template

This repository is a reusable template for standalone frontend applications built with Next.js App Router.

The goal is to keep the structure easy to understand, easy to extend, and strict enough to avoid chaos as the project grows.

## What this template focuses on

- Next.js App Router
- feature-based architecture
- thin route files
- reusable shared UI and styles
- React Context for cross-cutting app state
- TanStack Query for async server state
- Zod for validation
- TypeScript with clear folder responsibilities

## Main idea

The source code is split into three main layers:

- `src/app`
  This is the Next.js routing layer. Pages, layouts, route groups, dynamic routes, and loading/error route files live here.
- `src/features`
  This is where most application work happens. Each folder represents one feature and owns its own UI, hooks, API logic, schemas, and internal helpers.
- `src/shared`
  This contains reusable code that can be used by many features, such as buttons, style tokens, providers, generic hooks, and utility functions.

## Simple mental model

- `app` decides which screen the user is on
- `features` decide how a specific part of the product works
- `shared` contains building blocks reused in many places

## Example

Imagine you build a project details screen:

- route: `src/app/(app)/projects/[projectId]/page.tsx`
- feature logic and UI: `src/features/project/`
- reusable button or modal used by many features: `src/shared/ui/`

The route file should stay small and mostly delegate work to the feature.

## Before creating code

Open the local `README.md` files inside the folders you plan to use. Each one explains:

- what belongs there
- what should not go there
- small examples
- how that folder should depend on the others

This helps keep the template reusable across different projects.
