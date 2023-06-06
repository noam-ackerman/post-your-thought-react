import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useUsersCtx } from "../context/usersContext";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import styles from "../style-modules/style.module.css";
import { ExitSVG } from "./logos";

export default function UpdateSettingsModal(props) {
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
    removePostsLikes,
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

  const OvalElem = (
    <Oval
      height={22}
      width={22}
      color="#B5A1FF"
      wrapperStyle={{}}
      wrapperClass={styles.ovalBtn}
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#B5A1FF"
      strokeWidth={8}
      strokeWidthSecondary={8}
    />
  );

  function handleOverlayClick(event) {
    if (event.target !== modal.current) {
      props.toggleModalOpen();
    }
  }
  function cancelEdit() {
    props.toggleModalOpen();
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
    } else {
      if (!deleteClick) {
        setDeleteClick(true);
      } else {
        setLoading(true);
        try {
          await reAuthenticateUser(oldPasswordInput.current.value);
          try {
            setDeleting(true);
            await DeleteUser();
            currentUserData.posts?.forEach((post) => {
              removePostsLikes(post.id);
            });
            deleteStorageUser();
            deleteUserDatabase();
            document.querySelector("body").classList.remove("modal-open");
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
  }

  return (
    <>
      <div
        className={styles.modalOverlay}
        onClick={handleOverlayClick}
        style={{
          backgroundColor: deleting && "#c1f7dc",
          opacity: deleting && "1",
        }}
      ></div>
      <div ref={modal} className={styles.modalCard}>
        <button className={styles.exitBtn} onClick={cancelEdit}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={styles.SecondaryTitle}>Update Settings</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.formError}>{error}</div>}
          {message && <div className={styles.formMessage}>{message}</div>}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              className={styles.input}
              type="email"
              ref={emailInput}
              name="email"
              autoComplete="email"
              defaultValue={currentUser.email}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Old Password</label>
            <input
              className={styles.input}
              type="password"
              ref={oldPasswordInput}
              name="old-password"
              autoComplete="current-password"
              placeholder="Required for update"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>New Password</label>
            <input
              className={styles.input}
              type="password"
              autoComplete="new-password"
              ref={newPasswordInput}
              name="password"
              placeholder="Leave blank to keep"
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              New Password Confirmation
            </label>
            <input
              className={styles.input}
              type="password"
              ref={newPasswordConfirmInput}
              autoComplete="off"
              name="password-confirmation"
              placeholder="Leave blank to keep"
            />
          </div>
          <div className={styles.settingsActions}>
            <button
              className={styles.submitButton}
              type="submit"
              disabled={loading}
            >
              {loading && OvalElem}
              <span style={{ opacity: loading && "0" }}>Update</span>
            </button>
            <button
              className={styles.deleteAccountBtn}
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
