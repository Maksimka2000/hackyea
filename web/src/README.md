# Source

This folder contains all application source code.

The project is intentionally split into a small number of clear layers so that new code has an obvious home.

## Layers

- `app`
  Next.js routing layer. Use it for pages, layouts, route groups, dynamic route folders, loading states, and error boundaries.
- `features`
  Product features. This is where feature-specific UI, data fetching logic, validation, and internal helpers live.
- `shared`
  Reusable code used by multiple features, such as UI primitives, style foundations, providers, and generic helpers.

## Dependency direction

Try to keep dependencies moving in this direction:

- `app` can use `features` and `shared`
- `features` can use `shared`
- `shared` should not use `features` or `app`

## Why this matters

This rule prevents reusable code from depending on product-specific code.

That makes the project easier to understand and easier to reuse as a template.
