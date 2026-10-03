# Components

Put feature-specific React components here.

These components should mainly focus on rendering UI and handling user interaction.

## Good examples

- `ProjectTable.tsx`
- `ProfileHeader.tsx`
- `BillingPlanCard.tsx`
- `NotificationList.tsx`

## What belongs here

- feature-specific screens or sections
- presentational components
- small interactive UI pieces for this feature

## What should stay out

- route files
- generic shared UI like buttons or inputs
- heavy business logic
- generic utilities

## Example split

If you build a project details screen:

- reusable button: `src/shared/ui/primitives/Button.tsx`
- project-specific panel: `src/features/project/components/ProjectDetailsPanel.tsx`

## Rule

When a component becomes generic enough to be reused by multiple features, consider moving it to `src/shared/ui`.
