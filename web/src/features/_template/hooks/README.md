# Hooks

Use this folder for feature-specific custom hooks.

Hooks in this folder usually coordinate behavior rather than just render UI.

## Good examples

- `useProjectFilters`
- `useProfileForm`
- `useBillingActions`
- `useInviteMembersDialog`

## What belongs here

- UI state orchestration
- side effects
- event handling logic
- combining data from multiple helpers or queries

## What should stay out

- pure utility functions with no React behavior
- generic hooks reused across many features
- route files

## Example

A component might render a filter bar, while a hook:

- stores selected filters
- updates query params
- resets filters
- exposes derived values to the component

That keeps the component simpler.
