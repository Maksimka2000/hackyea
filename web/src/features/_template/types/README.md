# Types

Use this folder for feature-local TypeScript types that exist only inside your code and do not need runtime validation.

## Good examples

- component prop groups reused inside the feature
- view models created after transforming API data
- internal union types for feature behavior
- table row types

## What does not belong here

- data that should be validated at runtime
- types that are identical to an existing Zod schema

## Important rule

If a type comes from a schema, infer it from the schema instead of duplicating it manually.

Use this folder only for truly TypeScript-only internal models.
