# Types

Use this folder for foundational shared TypeScript types only when they are truly cross-feature.

## Good examples

- shared utility types
- common option item types
- app-wide generic type helpers

## Rule

- if the type belongs to one feature, keep it in that feature
- if the type can be inferred from a Zod schema, do not duplicate it here
- keep this folder small and intentional

This folder exists for a few shared building blocks, not for every type in the project.
