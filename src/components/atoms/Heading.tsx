import type { ReactNode } from "react";
import styles from "@/style-modules/global.module.css";

interface HeadingProps {
  level?: "main" | "secondary";
  children: ReactNode;
}

export function Heading({ level = "main", children }: HeadingProps) {
  const className = level === "main" ? styles.MainTitle : styles.SecondaryTitle;
  return <div className={className}>{children}</div>;
}
