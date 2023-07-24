import React, { useState } from "react";
import { ExitSVG } from "../resources/logos";
import { Oval } from "react-loader-spinner";
import styles from "../../style-modules/style.module.css";

export default function ProfileImage(props) {
  const [imageLoaded, setImageLoaded] = useState(false);

  function toggleImageModal() {
    props.toggleImageModal();
  }

  return (
    <div className={styles.profileImageModal}>
      <button
        className={`${styles.exitBtn} ${styles.exitBtnBackground}`}
        onClick={toggleImageModal}
      >
        <ExitSVG color="#7c606b" height="23px" width="23px" />
      </button>
      {!imageLoaded && (
        <Oval
          height={138}
          width={138}
          color="#B5A1FF"
          wrapperStyle={{}}
          wrapperClass={styles.ovalContainer}
          visible={true}
          ariaLabel="oval-loading"
          secondaryColor="#B5A1FF"
          strokeWidth={2}
          strokeWidthSecondary={2}
        />
      )}
      <img
        src={props.img}
        alt={props.username}
        className={styles.profileImageElement}
        style={{ display: imageLoaded ? "block" : "none" }}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
