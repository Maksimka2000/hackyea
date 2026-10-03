# Public

This folder is for static files that Next.js should serve directly.

## Good examples

- images
- icons
- logos
- downloadable files
- static JSON files used as assets

## Example paths

- `public/logo.svg`
- `public/images/empty-state.png`
- `public/files/privacy-policy.pdf`

These files are available in the browser by URL:

- `/logo.svg`
- `/images/empty-state.png`

## Do not put these here

- React components
- feature code
- TypeScript files
- style tokens
- generated build output

If a file is part of the source code architecture, it belongs in `src`, not in `public`.
