import { z } from "zod";

type FetchJsonOptions<TSchema extends z.ZodTypeAny | undefined> = RequestInit & {
  schema?: TSchema;
};

export async function fetchJson<TSchema extends z.ZodTypeAny | undefined>(
  input: RequestInfo | URL,
  options?: FetchJsonOptions<TSchema>,
): Promise<TSchema extends z.ZodTypeAny ? z.infer<TSchema> : unknown> {
  const { schema, ...requestInit } = options ?? {};
  const response = await fetch(input, requestInit);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}.`);
  }

  const data: unknown = await response.json();

  if (!schema) {
    return data as TSchema extends z.ZodTypeAny ? z.infer<TSchema> : unknown;
  }

  return schema.parse(data) as TSchema extends z.ZodTypeAny ? z.infer<TSchema> : unknown;
}

