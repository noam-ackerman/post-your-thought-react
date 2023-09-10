import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Oval } from "react-loader-spinner";
import ProfileImage from "../modals/profileImage";
import useToggleModal from "../../utilities/customHooks/useToggleModal";
import styles from "../../style-modules/style.module.css";

export default function ProfileBlockUnauthenticated({ user }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, toggleModal] = useToggleModal();

  return (
    <div className={styles.profileBlockWrapper}>
      <div className={styles.profileImageWrapper} onClick={toggleModal}>
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
          style={{ display: imageLoaded ? "block" : "none" }}
          src={user.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={user.displayName}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.detailProfile}>
          <span className={styles.detailLabel}>Username:</span>
          <span className={styles.detailTitle}>{user.displayName}</span>
        </div>
        {user.bio && (
          <div className={styles.detailProfile}>
            <span className={styles.detailLabel}>Bio:</span>
            <span className={styles.detailTitle}>{user.bio}</span>
          </div>
        )}
      </div>
      {modalOpen &&
        ReactDOM.createPortal(
          <ProfileImage
            toggleModal={toggleModal}
            username={user.displayName}
            img={user.photoURL}
          />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
