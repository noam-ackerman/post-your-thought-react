import { useRef, useState } from "react";
import type { ZodType } from "zod";
import { validateForm } from "@/utilities/validateForm";

export function useFormValidation<T>(schema: ZodType<T>) {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const hasAttemptedSubmit = useRef(false);

  function validate(values: unknown) {
    const result = validateForm(schema, values);
    setFieldErrors(result.errors ?? {});
    hasAttemptedSubmit.current = true;
    return result;
  }

  function revalidateIfAttempted(values: unknown) {
    if (hasAttemptedSubmit.current) {
      setFieldErrors(validateForm(schema, values).errors ?? {});
    }
  }

  return { fieldErrors, setFieldErrors, validate, revalidateIfAttempted };
}
