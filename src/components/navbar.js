import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styles from "../style-modules/style.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UpdateSettingsModal from "./updateSettingsModal";
import { useUsersCtx } from "../context/usersContext";
import { LogoutSVG, SettingsSVG, HomeSVG, SearchSVG } from "./logos";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, LogoutUser } = useAuth();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { currentUserData } = useUsersCtx();

  React.useEffect(() => {
    updateModalOpen
      ? document.querySelector("body").classList.add("modal-open")
      : document.querySelector("body").classList.remove("modal-open");
  }, [updateModalOpen]);

  function toggleModalOpen() {
    setUpdateModalOpen(!updateModalOpen);
  }

  async function HandleLogout() {
    try {
      await LogoutUser();
      navigate("/login");
    } catch {
      alert("Failed to log out!");
    }
  }

  return (
    <div className={styles.navContainer}>
      <div className={styles.MainTitleNav}>
        <Link to="/">Post Your Thought.</Link>
      </div>
      <div className={styles.actionWrapper}>
        <div className={styles.usernameNav}>
          Hi {currentUserData?.displayName || currentUser?.displayName}{" "}
          <span>(✧ω✧)☆</span>
        </div>
        <Link
          to={`/${currentUserData?.userId}`}
          title="My Profile"
          className={`${styles.profileImgThumbnailWrapper} ${styles.profileImageNav}`}
        >
          <img
            className={styles.profileImgThumbnail}
            src={currentUserData?.photoURL}
            alt={currentUserData?.displayName}
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>
        <Link to="/" title="Homepage" className={styles.actionButtonPrimary}>
          <HomeSVG color="#fff" height="22px" width="22px" />
        </Link>
        <Link
          to="/search-users"
          title="Search Users"
          className={styles.actionButtonPrimary}
        >
          <SearchSVG color="#fff" height="23px" width="23px" />
        </Link>
        <button
          onClick={toggleModalOpen}
          className={styles.actionButtonPrimary}
          title="Settings"
        >
          <SettingsSVG color="#fff" height="21px" width="21px" />
        </button>
        <button
          title="Log Out"
          onClick={HandleLogout}
          className={styles.actionButtonPrimary}
        >
          <LogoutSVG color="#fff" height="20px" width="20px" />
        </button>
      </div>
      {updateModalOpen &&
        ReactDOM.createPortal(
          <UpdateSettingsModal toggleModalOpen={toggleModalOpen} />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
