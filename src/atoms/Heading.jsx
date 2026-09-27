import React from "react";
import styles from "@/style-modules/global.module.css";

export function Heading({ level = "main", children }) {
  const className = level === "main" ? styles.MainTitle : styles.SecondaryTitle;
  return <div className={className}>{children}</div>;
}
