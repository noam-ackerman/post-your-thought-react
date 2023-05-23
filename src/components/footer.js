import React from "react";
import styles from "../style-modules/style.module.css";

export default function Footer() {
  return (
    <div className={styles.footer}>
      This site is an{" "}
      <a
        href="https://github.com/noam-ackerman/post-your-thought-react"
        target="_blank"
        rel="noreferrer"
        className={styles.codeLink}
      >
        open-source code
      </a>{" "}
      designed and built by{" "}
      <a
        href="https://www.linkedin.com/in/noam-ackerman/"
        target="_blank"
        rel="noreferrer"
        className={styles.codeLink}
      >
        Noam Ackerman
      </a>
    </div>
  );
}
