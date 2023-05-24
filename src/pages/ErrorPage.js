import React from "react";
import styles from "../style-modules/style.module.css";

export default function ErrorPage() {
  return (
    <>
      <div className={styles.ErrorContainer}>
        <div className={styles.MainTitle}>Something Went Wrong :(</div>
        <div className={styles.errorPageMessage}>
          Try to refresh the page or return later.
          <br />
          If this error still occurs,
          <br />
          Please contact me at{" "}
          <a href="mailto:developer.noam@gmail.com">
            developer.noam@gmail.com
          </a>{" "}
          <br />
          and describe your scenario!
        </div>
        <div className={styles.SecondaryTitle}>Thank you and apologies!</div>
      </div>
    </>
  );
}
