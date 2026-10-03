# Styles

This folder is the reusable styling foundation for the application.

The goal is to avoid repeating visual values all over the codebase.

## What belongs here

- design tokens
- semantic color variables
- reusable utility classes
- shared animation definitions
- app-wide style layers

## Current files

- `tokens.css`
  Global design tokens such as colors, radii, shadows, and motion values
- `utilities.css`
  Shared CSS utility patterns used in many screens
- `animations.css`
  Reusable animation keyframes and classes

## Why keep this separate

`src/app/globals.css` is only the entry point for global CSS in Next.js.

The real reusable style system should live here so it stays organized and easy to maintain.
