# Config

Use this folder for small app-level configuration objects.

Configuration is usually static or declarative data that helps the app behave a certain way.

## Good examples

- navigation item definitions
- feature flags
- app sections
- environment-derived settings

## Example

A sidebar item list is usually config:

- label
- href
- icon name

That is not business logic. It is just application setup data.

## Rule

Keep config simple and declarative.

Do not put business workflows or feature-specific logic here.
