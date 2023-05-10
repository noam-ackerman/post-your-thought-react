import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";
import EditProfileModal from "./editProfileModal";
import styles from "../style-modules/style.module.css";

export default function ProfileContent() {
  const { currentUser, defaultAvatarUrl } = useAuth();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const profileImg = useRef();

  function toggleModalOpen() {
    setUpdateModalOpen(!updateModalOpen);
  }

  React.useEffect(() => {
    updateModalOpen
      ? document.querySelector("body").classList.add("modal-open")
      : document.querySelector("body").classList.remove("modal-open");
  }, [updateModalOpen]);

  return (
    <div className={styles.profileBlockWrapper}>
      <div className={styles.SecondaryTitle}>My Profile</div>
      <div className={styles.profileImageWrapper} onClick={toggleModalOpen}>
        <img
          ref={profileImg}
          src={currentUser.photoURL ? currentUser.photoURL : defaultAvatarUrl}
          alt={
            currentUser.displayName
              ? currentUser.displayName
              : currentUser.email
          }
          className={styles.profileImage}
        />
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.nicknameProfile}>
          <span className={styles.nicknameLabel}>Nickname:</span>
          <span className={styles.nicknameTitle}>
            {currentUser.displayName
              ? currentUser.displayName
              : currentUser.email.split("@")[0]}
          </span>
        </div>
        <button
          onClick={toggleModalOpen}
          className={styles.actionButtonPrimary}
        >
          Edit Profile
        </button>
      </div>
      {updateModalOpen &&
        ReactDOM.createPortal(
          <EditProfileModal toggleModalOpen={toggleModalOpen} />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
