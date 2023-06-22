import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Oval } from "react-loader-spinner";
import EditProfileModal from "../modals/editProfileModal";
import { useUsersCtx } from "../../context/usersContext";
import ProfileImage from "../modals/profileImage";
import styles from "../../style-modules/style.module.css";

export default function ProfileBlockAuthenticated() {
  const { currentUserData } = useUsersCtx();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [modalImageOpen, setModalImageOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  function toggleImageModal() {
    setModalImageOpen(!modalImageOpen);
  }

  function toggleModalOpen() {
    setUpdateModalOpen(!updateModalOpen);
  }

  React.useEffect(() => {
    updateModalOpen || modalImageOpen
      ? document.querySelector("html").classList.add("modal-open")
      : document.querySelector("html").classList.remove("modal-open");
  }, [updateModalOpen, modalImageOpen]);

  return (
    <div className={styles.profileBlockWrapper}>
      <div className={styles.profileImageWrapper} onClick={toggleImageModal}>
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
          onClick={toggleModalOpen}
          className={`${styles.actionButtonPrimary} ${styles.marginTopBottom1}`}
        >
          Edit Profile
        </button>
      </div>
      {updateModalOpen &&
        ReactDOM.createPortal(
          <EditProfileModal toggleModalOpen={toggleModalOpen} />,
          document.getElementById("modal-root")
        )}
      {modalImageOpen &&
        ReactDOM.createPortal(
          <ProfileImage
            toggleImageModal={toggleImageModal}
            username={currentUserData.displayName}
            img={currentUserData.photoURL}
          />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
