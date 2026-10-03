# Context

Use this folder for feature-local React Context.

Create a context here only when many nested components inside the same feature need shared client state or shared feature actions.

## Good examples

- multi-step form state inside one feature
- local dialog workflow shared by many components in the feature
- feature-specific UI mode or selection state

## What should stay out

- global app state
- server state
- simple local component state

## Rule

If the context is only useful inside one feature, keep it here.

If it becomes cross-app or cross-feature, move it to `src/shared/contexts`.
