# Utils

Use this folder for pure feature-local helper functions.

These helpers should not depend on React and should usually be easy to test.

## Good examples

- formatting feature-specific labels
- mapping API data into UI models
- sorting logic for one feature
- small pure helper functions

## What should stay out

- React hooks
- generic helpers reused by many features
- large business workflows mixed with side effects

## Rule

Keep a helper here if it is specific to one feature.

If it becomes widely reusable, move it to `src/shared/lib` or another shared folder that fits better.
