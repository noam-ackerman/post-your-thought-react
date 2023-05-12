import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";
import { Oval } from "react-loader-spinner";
import EditProfileModal from "./editProfileModal";
import styles from "../style-modules/style.module.css";

export default function ProfileContent() {
  const { currentUser } = useAuth();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
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
      <div className={styles.profileImageWrapper} onClick={toggleModalOpen}>
        {!imageLoaded && (
          <Oval
            height={138}
            width={138}
            color="#B5A1FF"
            wrapperStyle={{}}
            wrapperClass={styles.ovalProfileImage}
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#B5A1FF"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
        <img
          ref={profileImg}
          style={{ display: imageLoaded ? "block" : "none" }}
          src={currentUser.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={currentUser.displayName}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.nicknameProfile}>
          <span className={styles.nicknameLabel}>Nickname:</span>
          <span className={styles.nicknameTitle}>
            {currentUser.displayName}
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
