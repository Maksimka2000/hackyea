# Schemas

Put Zod schemas here.

Schemas are used when data needs runtime validation.

## Use schemas for

- form data
- URL params when helpful
- API responses
- local storage values
- any data coming from outside your code

## Example

If your app receives project data from an API, a schema can check that the response really has the shape you expect.

## Why this matters

TypeScript alone does not validate runtime data.

If bad data comes from an API, TypeScript will not stop it at runtime. A schema can.

## Important rule

If you need a TypeScript type that matches a schema, prefer:

`z.infer<typeof yourSchema>`

Do not manually rewrite the same shape in `types` unless you are creating a different internal model.
