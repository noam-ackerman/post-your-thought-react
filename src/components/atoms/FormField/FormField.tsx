import {
  forwardRef,
  type ReactNode,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import fieldStyles from "./formField.module.css";

type FieldElement = HTMLInputElement | HTMLTextAreaElement;
type FieldProps = InputHTMLAttributes<HTMLInputElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement>;

interface FormFieldProps extends FieldProps {
  label: ReactNode;
  as?: "input" | "textarea";
  children?: ReactNode;
  error?: string;
}

export const FormField = forwardRef<FieldElement, FormFieldProps>(function FormField(
  { label, as = "input", children, error, className, ...fieldProps },
  ref
) {
  const Field = as;
  const baseClassName = as === "textarea" ? fieldStyles.textarea : fieldStyles.input;
  const fieldClassName = [className || baseClassName, error && fieldStyles.errorInput]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={fieldStyles.inputGroup}>
      <label className={fieldStyles.inputLabel}>{label}</label>
      {children ?? (
        <Field
          className={fieldClassName}
          ref={ref as React.Ref<HTMLInputElement> & React.Ref<HTMLTextAreaElement>}
          {...fieldProps}
        />
      )}
      {error && <div className={fieldStyles.errorText}>{error}</div>}
    </div>
  );
});
