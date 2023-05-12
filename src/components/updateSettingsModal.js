import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "../style-modules/style.module.css";
import { ExitSVG } from "./logos";

export default function UpdateSettingsModal(props) {
  const { currentUser, LoginUser, UpdateEmail, UpdatePassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const emailInput = useRef();
  const oldPasswordInput = useRef();
  const newPasswordInput = useRef();
  const newPasswordConfirmInput = useRef();
  const modal = useRef();

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
      await LoginUser(currentUser.email, oldPasswordInput.current.value);
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

  return (
    <>
      <div className={styles.modalOverlay} onClick={handleOverlayClick}></div>
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
              placeholder="Required for update"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>New Password</label>
            <input
              className={styles.input}
              type="password"
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
              name="password-confirmation"
              placeholder="Leave blank to keep"
            />
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
}
