# Features

This folder contains the actual product features of the application.

If you are wondering where most day-to-day work should happen, the answer is usually here.

## What is a feature

A feature is a part of the product with one clear responsibility.

Examples:

- authentication
- project management
- notifications
- billing
- user profile

## What a feature owns

Each feature should keep its own:

- UI components
- hooks
- local context when needed
- API and TanStack Query logic
- schemas
- types
- constants
- internal helpers

## Why this structure exists

Keeping feature code together is easier than splitting one feature across many global folders.

Instead of searching in five unrelated places, you open one feature folder and find almost everything there.

## Rule of thumb

If code belongs mainly to one product area, keep it inside that feature.

Only move code to `src/shared` when it is truly reusable across multiple features.

## Starting point

Use the `_template` folder when creating a new feature.
