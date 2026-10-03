# Auth Group

This route group is for authentication-related routes.

## Good examples

- sign in
- sign up
- forgot password
- reset password
- invitation acceptance
- email verification

## Important rule

Routing for auth lives here, but auth feature code should still live in `src/features`.

## Example

- route: `src/app/(auth)/sign-in/page.tsx`
- feature code: `src/features/auth/`

That keeps the URL structure separate from the auth implementation.
