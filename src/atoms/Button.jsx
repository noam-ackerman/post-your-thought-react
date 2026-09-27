import React, { forwardRef } from "react";
import { OvalBtn } from "@/primitives/spinners";
import styles from "./button.module.css";

export const Button = forwardRef(function Button(
  { color = "primary", shape = "default", className, disabled, loading, children, ...rest },
  ref
) {
  const classes = [styles.base, styles[shape], styles[color], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button ref={ref} className={classes} disabled={disabled ?? loading} {...rest}>
      {loading && <OvalBtn />}
      <span style={loading !== undefined ? { opacity: loading && "0" } : undefined}>
        {children}
      </span>
    </button>
  );
});
