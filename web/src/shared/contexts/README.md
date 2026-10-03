# Contexts

This folder contains shared React Context definitions used across the app.

Use this folder when state or behavior needs to be available in many places and does not belong to one single feature.

## Good examples

- app shell state
- theme state
- session or auth view state
- locale or timezone state

## What belongs here

- `createContext(...)`
- provider components for shared context
- custom hooks such as `useAppShellContext`

## What should stay out

- provider composition for the whole app
- feature-only context
- server state

## Important rule

Context is for cross-cutting client state, not for all state.

Use:

- Context for cross-app shared client state
- TanStack Query for server state
- local React state for component-local behavior

## Example

If many parts of the UI need to know whether the sidebar is open, that can live in a shared context here.
