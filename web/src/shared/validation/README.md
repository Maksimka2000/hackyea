# Validation

Use this folder for shared validation helpers and shared schemas.

## Good examples

- reusable Zod helper functions
- shared schema fragments
- common validators such as email or pagination helpers

## Rule

If validation belongs to one feature only, keep it inside that feature's `schemas` folder.

Move validation here only when reuse across features is real.
