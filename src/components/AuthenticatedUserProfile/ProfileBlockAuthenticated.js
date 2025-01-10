import React, { useState } from "react";
import ReactDOM from "react-dom";
import { OvalContainer } from "../../utilities/spinners";
import { useUsersCtx } from "../../context/usersContext";
import EditProfileModal from "../modals/editProfileModal";
import ProfileImage from "../modals/profileImage";
import useToggleModal from "../../utilities/customHooks/useToggleModal";
import profileStyles from "../../style-modules/pages/profile.module.css";
import styles from "../../style-modules/global.module.css";

export default function ProfileBlockAuthenticated() {
  const { currentUserData } = useUsersCtx();
  const [modalOpen1, toggleModal1] = useToggleModal();
  const [modalOpen2, toggleModal2] = useToggleModal();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={profileStyles.profileBlockWrapper}>
      <div className={profileStyles.profileImageWrapper} onClick={toggleModal1}>
        {!imageLoaded && <OvalContainer />}
        <img
          style={{ display: imageLoaded ? "block" : "none" }}
          src={currentUserData.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={currentUserData.displayName}
          className={profileStyles.profileImage}
        />
      </div>
      <div className={profileStyles.profileDetailsWrapper}>
        <div className={profileStyles.detailsProfile}>
          <span className={profileStyles.detailsLabel}>Username:</span>
          <span>{currentUserData.displayName}</span>
        </div>
        {currentUserData.bio !== "" && (
          <div className={profileStyles.detailsProfile}>
            <span className={profileStyles.detailsLabel}>Bio:</span>
            <span>{currentUserData.bio}</span>
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
