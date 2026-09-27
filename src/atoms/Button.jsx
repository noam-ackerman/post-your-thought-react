import React, { forwardRef } from "react";
import { OvalBtn } from "@/primitives/spinners";
import globalStyles from "@/style-modules/global.module.css";

export const Button = forwardRef(function Button(
  { variant = "primary", styles, loading, className, disabled, children, ...rest },
  ref
) {
  const variantClassName =
    className ||
    (variant === "submit" ? styles.submitButton : globalStyles.actionButtonPrimary);

  return (
    <button
      ref={ref}
      className={variantClassName}
      disabled={disabled ?? loading}
      {...rest}
    >
      {loading && <OvalBtn />}
      <span style={loading !== undefined ? { opacity: loading && "0" } : undefined}>
        {children}
      </span>
    </button>
  );
});
