import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import styles from "../style-modules/style.module.css";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import UpdateSettingsModal from "./updateSettingsModal";
import { LogoutSVG, SettingsSVG } from "./logos";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser, LogoutUser, defaultAvatarUrl, currentUserUpdating } =
    useAuth();
  const [updateModalOpen, setUpdateModalOpen] = useState(false);

  React.useEffect(() => {
    updateModalOpen
      ? document.querySelector("body").classList.add("modal-open")
      : document.querySelector("body").classList.remove("modal-open");
  }, [updateModalOpen]);

  React.useEffect(() => {}, [currentUserUpdating]);

  console.log("updated");

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
      <div className={styles.actionWrapperNav}>
        <div className={styles.usernameNav}>
          Hi{" "}
          {currentUser.displayName
            ? currentUser.displayName
            : currentUser.email.split("@")[0]}{" "}
          (✧ω✧)☆
        </div>
        <Link to="/profile" className={styles.profileImgThumbnailWrapper}>
          <img
            className={styles.profileImgThumbnail}
            src={currentUser.photoURL ? currentUser.photoURL : defaultAvatarUrl}
            alt={
              currentUser.displayName
                ? currentUser.displayName
                : currentUser.email
            }
          />
        </Link>
        <button
          onClick={toggleModalOpen}
          className={styles.actionButtonPrimary}
        >
          <SettingsSVG color="#fff" height="20px" width="20px" />
        </button>
        <button onClick={HandleLogout} className={styles.actionButtonPrimary}>
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
