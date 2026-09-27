import { forwardRef, type ButtonHTMLAttributes } from "react";
import { OvalBtn } from "@/primitives/spinners";
import styles from "./button.module.css";

type ButtonColor = "primary" | "pink" | "danger" | "info";
type ButtonShape = "default" | "compact" | "fullWidth";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { color = "primary", shape = "default", className, disabled, loading, children, ...rest },
  ref
) {
  const classes = [styles.base, styles[shape], styles[color], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classes} disabled={disabled ?? loading} {...rest}>
      {loading && <OvalBtn />}
      <span style={loading !== undefined ? { opacity: loading ? 0 : undefined } : undefined}>
        {children}
      </span>
    </button>
  );
});
