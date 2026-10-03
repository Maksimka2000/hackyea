# Styles

Design foundation for the whole app.

- `tokens.css`: colours, radii, shadows, the three text sizes, and the high-contrast overrides. Components use only the semantic names defined here.
- `utilities.css`: small Tailwind utilities (`border-line`, `on-dark`, the `contrast-high:` variant).

`src/app/globals.css` only imports these and sets base styles (focus ring, reduced motion).
