import React, { forwardRef } from "react";

export const FormField = forwardRef(function FormField(
  { styles, label, as = "input", children, ...fieldProps },
  ref
) {
  const Field = as;
  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      {children ?? <Field className={styles.input} ref={ref} {...fieldProps} />}
    </div>
  );
});
