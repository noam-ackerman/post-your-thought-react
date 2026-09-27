import type { ZodType } from "zod";

type ValidationResult<T> =
  | { data: T; errors: null }
  | { data: null; errors: Record<string, string> };

export function validateForm<T>(schema: ZodType<T>, values: unknown): ValidationResult<T> {
  const result = schema.safeParse(values);
  if (result.success) {
    return { data: result.data, errors: null };
  }
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0]);
    if (!errors[key]) errors[key] = issue.message;
  }
  return { data: null, errors };
}
