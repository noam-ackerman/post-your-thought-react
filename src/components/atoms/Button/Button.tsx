import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Link } from "react-router-dom";
import { OvalBtn } from "../Spinners/spinners";
import styles from "./button.module.css";

type ButtonColor = "primary" | "secondary" | "pink" | "danger";
type ButtonShape = "default" | "compact" | "fullWidth";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  as?: typeof Link;
  to?: string;
  color?: ButtonColor;
  shape?: ButtonShape;
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { as, to, color = "primary", shape = "default", className, disabled, loading, children, title, ...rest },
  ref
) {
  const classes = [styles.base, styles[shape], styles[color], className]
    .filter(Boolean)
    .join(" ");

  if (as === Link && to) {
    return (
      <Link to={to} className={classes} title={title}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} disabled={disabled ?? loading} title={title} {...rest}>
      {loading && <OvalBtn />}
      <span style={loading !== undefined ? { opacity: loading ? 0 : undefined } : undefined}>
        {children}
      </span>
    </button>
  );
});
