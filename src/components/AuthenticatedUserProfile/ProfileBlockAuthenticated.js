import React, { useState } from "react";
import ReactDOM from "react-dom";
import { OvalContainer } from "../../utilities/spinners";
import { useUsersCtx } from "../../context/usersContext";
import EditProfileModal from "../modals/editProfileModal";
import ProfileImage from "../modals/profileImage";
import useToggleModal from "../../utilities/customHooks/useToggleModal";
import styles from "../../style-modules/style.module.css";

export default function ProfileBlockAuthenticated() {
  const { currentUserData } = useUsersCtx();
  const [modalOpen1, toggleModal1] = useToggleModal();
  const [modalOpen2, toggleModal2] = useToggleModal();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={styles.profileBlockWrapper}>
      <div className={styles.profileImageWrapper} onClick={toggleModal1}>
        {!imageLoaded && <OvalContainer />}
        <img
          style={{ display: imageLoaded ? "block" : "none" }}
          src={currentUserData.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={currentUserData.displayName}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.detailProfile}>
          <span className={styles.detailLabel}>Username:</span>
          <span className={styles.detailTitle}>
            {currentUserData.displayName}
          </span>
        </div>
        {currentUserData.bio !== "" && (
          <div className={styles.detailProfile}>
            <span className={styles.detailLabel}>Bio:</span>
            <span className={styles.detailTitle}>{currentUserData.bio}</span>
          </div>
        )}
        <button
          onClick={toggleModal2}
          className={`${styles.actionButtonPrimary} ${styles.marginTopBottom1}`}
        >
          Edit Profile
        </button>
      </div>
      {modalOpen1 &&
        ReactDOM.createPortal(
          <ProfileImage
            toggleModal={toggleModal1}
            username={currentUserData.displayName}
            img={currentUserData.photoURL}
          />,
          document.getElementById("modal-root")
        )}
      {modalOpen2 &&
        ReactDOM.createPortal(
          <EditProfileModal toggleModal={toggleModal2} />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
