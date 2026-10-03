# Shared

This layer contains code that can be reused by multiple features.

Think of `shared` as the toolbox of the application.

## What belongs here

- reusable UI primitives
- style tokens and shared CSS layers
- app-wide providers
- app-wide contexts
- generic hooks
- generic utilities
- shared validation helpers
- truly shared constants or types

## What does not belong here

- feature-specific business logic
- route files
- code that is only used by one feature

## Important dependency rule

`shared` must not import from `features` or from route files in `app`.

Why:

Reusable code should not depend on product-specific code. If it does, it is not really shared anymore.
