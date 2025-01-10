import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { OvalBtn } from "../utilities/spinners";
import styles from "../style-modules/global.module.css";
import authStyles from "../style-modules/pages/authPage.module.css";

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
    <div className={authStyles.container}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={authStyles.card}>
        <div className={styles.SecondaryTitle}>Reset Password</div>
        <form className={authStyles.form} onSubmit={handleSubmit}>
          {error && <div className={authStyles.error}>{error}</div>}
          {message && <div className={authStyles.message}>{message}</div>}
          <div className={authStyles.inputGroup}>
            <label className={authStyles.inputLabel}>Email</label>
            <input
              className={authStyles.input}
              type="email"
              ref={emailInput}
              name="email"
              autoComplete="email"
              placeholder="example@example.com"
              required
            />
          </div>
          <button
            className={authStyles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading && <OvalBtn />}
            <span style={{ opacity: loading && "0" }}>Reset Password</span>
          </button>
        </form>
        <div className={authStyles.linkText}>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
