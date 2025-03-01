import React, { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsersCtx } from "../../context/usersContext";
import { useNavigate } from "react-router-dom";
import { OvalBtn } from "../../utilities/spinners";
import { ExitSVG } from "../../utilities/icons";
import styles from "../../style-modules/global.module.css";
import modalStyles from "../../style-modules/components/modals.module.css";

export default function UpdateSettingsModal({ toggleModal }) {
  const {
    currentUser,
    UpdateEmail,
    UpdatePassword,
    DeleteUser,
    reAuthenticateUser,
  } = useAuth();
  const {
    currentUserData,
    deleteUserDatabase,
    deleteStorageUser,
    postsData,
    removePost,
  } = useUsersCtx();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteClick, setDeleteClick] = useState(false);
  const navigate = useNavigate();

  const emailInput = useRef();
  const oldPasswordInput = useRef();
  const newPasswordInput = useRef();
  const newPasswordConfirmInput = useRef();
  const modal = useRef();

  function handleOverlayClick(event) {
    if (event.target !== modal.current) toggleModal();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await reAuthenticateUser(oldPasswordInput.current.value);
      if (
        newPasswordInput.current.value !== newPasswordConfirmInput.current.value
      ) {
        return setError("Passwords do not match!");
      }
      if (emailInput.current.value !== currentUser.email) {
        try {
          await UpdateEmail(emailInput.current.value);
        } catch (err) {
          if (err.code === "auth/invalid-email") {
            return setError("Failed to update! Invalid email.");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      if (newPasswordInput.current.value) {
        try {
          await UpdatePassword(newPasswordInput.current.value);
        } catch (err) {
          if (err.code === "auth/weak-password") {
            setError("Password must be at least 6 characters long");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      setMessage("Your setting were updated!");
    } catch {
      return setError("Failed! Incorrent password");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    setError("");
    setMessage("");
    if (!oldPasswordInput.current.checkValidity()) {
      oldPasswordInput.current.reportValidity();
      return;
    }
    if (!deleteClick) {
      setDeleteClick(true);
    } else {
      setLoading(true);
      try {
        await reAuthenticateUser(oldPasswordInput.current.value);
        try {
          setDeleting(true);
          document.querySelector("body").classList.remove("modal-open");
          const userPosts = Object.values(postsData).filter(
            (post) => post.userId === currentUserData.userId
          );
          userPosts.forEach((post) => {
            removePost(post.postId);
          });
          await deleteUserDatabase();
          await deleteStorageUser();
          await DeleteUser();
          navigate("/login");
        } catch {
          setError("Failed to delete account!");
          setDeleting(false);
          setDeleteClick(false);
        }
      } catch {
        setError("Failed! Incorrent password");
        setDeleteClick(false);
      }
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className={modalStyles.modalOverlay}
        onClick={handleOverlayClick}
        style={{
          backgroundColor: deleting && "#c1f7dc",
          opacity: deleting && "1",
        }}
      ></div>
      <div ref={modal} className={modalStyles.modalCard}>
        <button className={modalStyles.exitBtn} onClick={toggleModal}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={styles.SecondaryTitle}>Update Settings</div>
        <form className={modalStyles.form} onSubmit={handleSubmit}>
          {error && <div className={modalStyles.formError}>{error}</div>}
          {message && <div className={modalStyles.formMessage}>{message}</div>}
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>Email</label>
            <input
              className={modalStyles.input}
              type="email"
              ref={emailInput}
              name="email"
              autoComplete="email"
              defaultValue={currentUser.email}
              required
            />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>Old Password</label>
            <input
              className={modalStyles.input}
              type="password"
              ref={oldPasswordInput}
              name="old-password"
              autoComplete="current-password"
              placeholder="Required for update"
              required
            />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>New Password</label>
            <input
              className={modalStyles.input}
              type="password"
              autoComplete="new-password"
              ref={newPasswordInput}
              name="password"
              placeholder="Leave blank to keep"
            />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>
              New Password Confirmation
            </label>
            <input
              className={modalStyles.input}
              type="password"
              ref={newPasswordConfirmInput}
              autoComplete="off"
              name="password-confirmation"
              placeholder="Leave blank to keep"
            />
          </div>
          <div className={modalStyles.settingsActions}>
            <button
              className={modalStyles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading && <OvalBtn />}
              <span style={{ opacity: loading && "0" }}>Update</span>
            </button>
            <button
              className={modalStyles.deleteAccountBtn}
              onClick={handleDeleteUser}
              disabled={loading}
              type="button"
            >
              {!deleteClick ? "Delete My Account" : "Are you sure? 'Yes'"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
