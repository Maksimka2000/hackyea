# Composite

This folder is for reusable UI components that are built from smaller primitives.

They are larger than primitives, but still generic enough to be shared by different features.

## Good examples

- card shells
- modal layouts
- section wrappers
- empty state blocks
- generic form sections

## Example

A `Surface` or `Panel` component belongs here because many features can use it.

A `ProjectDetailsPanel` does not belong here because it is tied to one feature.

## Rule

Keep this folder generic. Do not move feature-specific sections here just because they look reusable at first glance.
