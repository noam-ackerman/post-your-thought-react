import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "../style-modules/style.module.css";

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const emailInput = useRef();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailInput.current.value);
      setMessage("Check your inbox for further instructions!");
    } catch (err) {
      setError("Failed to reset password!");
    }
    setLoading(false);
  }

  return (
    <div className={styles.AuthContainer}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={styles.cardPrimary}>
        <div className={styles.SecondaryTitle}>Reset Password</div>
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
              placeholder="example@example.com"
              required
            />
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            Reset Password
          </button>
        </form>
        <div className={styles.linkText}>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
