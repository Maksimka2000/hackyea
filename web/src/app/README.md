# App

This folder is the Next.js App Router layer.

If you are new to Next.js, think of this folder as the place where URL structure lives.

## What belongs here

- `page.tsx` files
- `layout.tsx` files
- route groups such as `(app)` or `(auth)`
- dynamic route folders such as `[id]`
- `loading.tsx`, `error.tsx`, `not-found.tsx`
- route-level composition

## What does not belong here

- large feature UI trees
- business logic
- heavy state orchestration
- generic reusable components
- validation logic for entire features

## Main rule

Files in `app` should stay thin.

A route file should usually do only a few things:

- read route params
- choose the page layout
- render the correct feature entry point

## Example

For a project details route:

- route file: `src/app/(app)/projects/[projectId]/page.tsx`
- feature implementation: `src/features/project/`

The route file should not contain all the fetching, rendering, and event logic itself.

## Why

Keeping `app` thin makes routing easy to scan and prevents pages from becoming giant files.
