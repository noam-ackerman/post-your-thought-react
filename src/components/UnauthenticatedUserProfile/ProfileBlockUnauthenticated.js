import React, { useState } from "react";
import ReactDOM from "react-dom";
import { OvalContainer } from "../../utilities/spinners";
import ProfileImage from "../modals/profileImage";
import useToggleModal from "../../utilities/customHooks/useToggleModal";
import profileStyles from "../../style-modules/pages/profile.module.css";

export default function ProfileBlockUnauthenticated({ user }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [modalOpen, toggleModal] = useToggleModal();

  return (
    <div className={profileStyles.profileBlockWrapper}>
      <div className={profileStyles.profileImageWrapper} onClick={toggleModal}>
        {!imageLoaded && <OvalContainer />}
        <img
          style={{ display: imageLoaded ? "block" : "none" }}
          src={user.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={user.displayName}
          className={profileStyles.profileImage}
        />
      </div>
      <div className={profileStyles.profileDetailsWrapper}>
        <div className={profileStyles.detailsProfile}>
          <span className={profileStyles.detailsLabel}>Username:</span>
          <span>{user.displayName}</span>
        </div>
        {user.bio && (
          <div className={profileStyles.detailsProfile}>
            <span className={profileStyles.detailsLabel}>Bio:</span>
            <span>{user.bio}</span>
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
