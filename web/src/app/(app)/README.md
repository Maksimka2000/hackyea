# App Group

This route group is for the main application area.

Use it for screens that belong to the actual product after the user enters the app.

## Good examples

- dashboard
- projects
- settings
- workspace pages
- billing pages
- any screen that uses the main app shell or sidebar

## Example structure

```txt
(app)/
  layout.tsx
  dashboard/
    page.tsx
  projects/
    page.tsx
  projects/
    [projectId]/
      page.tsx
```

This group is useful because it lets you share layouts without affecting public or auth screens.
