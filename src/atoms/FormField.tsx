import {
  forwardRef,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

type FieldElement = HTMLInputElement | HTMLTextAreaElement;
type FieldProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormFieldProps extends FieldProps {
  styles: { readonly [key: string]: string };
  label: ReactNode;
  as?: "input" | "textarea";
  children?: ReactNode;
}

export const FormField = forwardRef<FieldElement, FormFieldProps>(function FormField(
  { styles, label, as = "input", children, ...fieldProps },
  ref
) {
  const Field = as;
  return (
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel}>{label}</label>
      {children ?? (
        <Field
          className={styles.input}
          ref={ref as React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>}
          {...fieldProps}
        />
      )}
    </div>
  );
});
