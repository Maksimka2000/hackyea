# Lib

This folder contains generic technical helpers.

These helpers are not tied to one feature and are usually not UI components.

## Good examples

- class name merge helpers
- generic fetch wrappers
- query client setup
- formatting helpers with no business meaning

## Current examples in this template

- `cn.ts`
  Combines class names cleanly
- `fetch-json.ts`
  Small helper for fetching JSON with optional schema validation
- `query-client.ts`
  Creates the TanStack Query client

## Rule

If a helper contains business meaning such as project, billing, or auth-specific behavior, it should stay inside the relevant feature instead.
