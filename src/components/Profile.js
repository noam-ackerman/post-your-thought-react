import React from "react";
import Navbar from "./navbar";
import ProfileBlock from "./ProfileBlock";
import styles from "../style-modules/style.module.css";

export default function Profile() {
  return (
    <>
      <Navbar />
      <div className={styles.profileContainerContent}>
        <ProfileBlock />
      </div>
    </>
  );
}
