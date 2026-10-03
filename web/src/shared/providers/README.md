# Providers

This folder contains app-wide React providers and contexts.

If you are new to React, a provider is a way to make shared state or shared services available to many components without passing props through many levels.

## Good examples

- TanStack Query provider
- theme provider
- lightweight app shell context
- localization provider

## Current examples in this template

- `AppProviders.tsx`
  Combines the providers used by the app

## Rule

This folder should focus on provider composition.

Actual shared context definitions should live in `src/shared/contexts`.

Use providers for cross-cutting concerns.

Do not use them as the default place for all state. Feature-specific state usually belongs inside the feature.
