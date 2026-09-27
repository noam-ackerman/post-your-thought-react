import React, { useState } from "react";
import ReactDOM from "react-dom";
import { OvalContainer } from "@/primitives/spinners";
import { EditProfileModal } from "@/components/modals/EditProfileModal";
import { ProfileImage } from "@/components/modals/ProfileImage";
import { useToggleModal } from "@/utilities/customHooks/useToggleModal";
import { Button } from "@/atoms";
import profileStyles from "@/style-modules/pages/profile.module.css";
import styles from "@/style-modules/global.module.css";

export function ProfileBlock({ user, canEdit }) {
  const [imageModalOpen, toggleImageModal] = useToggleModal();
  const [editModalOpen, toggleEditModal] = useToggleModal();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={profileStyles.profileBlockWrapper}>
      <div
        className={profileStyles.profileImageWrapper}
        onClick={toggleImageModal}
      >
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
        {canEdit && (
          <Button
            onClick={toggleEditModal}
            className={`${styles.actionButtonPrimary} ${styles.marginTopBottom1}`}
          >
            Edit Profile
          </Button>
        )}
      </div>
      {imageModalOpen &&
        ReactDOM.createPortal(
          <ProfileImage
            toggleModal={toggleImageModal}
            username={user.displayName}
            img={user.photoURL}
          />,
          document.getElementById("modal-root")
        )}
      {canEdit && editModalOpen && (
        <EditProfileModal toggleModal={toggleEditModal} />
      )}
    </div>
  );
}
