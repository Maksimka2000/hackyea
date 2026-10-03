# Constants

Use this folder for feature-local static values.

## Good examples

- status options for a select
- pagination defaults
- empty-state text
- local limits
- UI labels reused across this feature only

## Example

For a billing feature, this folder might contain:

- plan labels
- table page size options
- local badge color mappings

## Rule

If the constant is used only by this feature, keep it here.

If the same constant becomes useful across multiple features, move it to `src/shared/constants`.
