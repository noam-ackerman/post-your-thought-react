import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { OvalBtn } from "../utilities/spinners";
import styles from "../style-modules/global.module.css";
import authStyles from "../style-modules/pages/authPage.module.css";

export default function Signup() {
  const { SignupUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const passwordConfirmInput = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordInput.current.value !== passwordConfirmInput.current.value) {
      return setError("Passwords do not match!");
    }
    try {
      setError("");
      setLoading(true);
      await SignupUser(emailInput.current.value, passwordInput.current.value);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-email") {
        setError("Failed to sign up! Invalid email.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters long");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use!");
      } else {
        setError("Failed to sign up!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={authStyles.container}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={authStyles.card}>
        <div className={styles.SecondaryTitle}>Sign Up</div>
        <form className={authStyles.form} onSubmit={handleSubmit}>
          {error && <div className={authStyles.error}>{error}</div>}
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
          <div className={authStyles.inputGroup}>
            <label className={authStyles.inputLabel}>Password</label>
            <input
              className={authStyles.input}
              type="password"
              ref={passwordInput}
              name="password"
              placeholder="=< 6 characters"
              autoComplete="new-password"
              required
            />
          </div>
          <div className={authStyles.inputGroup}>
            <label className={authStyles.inputLabel}>
              Password Confirmation
            </label>
            <input
              className={authStyles.input}
              type="password"
              ref={passwordConfirmInput}
              name="password-confirmation"
              placeholder="=< 6 characters"
              autoComplete="off"
              required
            />
          </div>
          <button
            className={authStyles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading && <OvalBtn />}
            <span style={{ opacity: loading && "0" }}>Sign Up</span>
          </button>
        </form>
      </div>
      <div className={authStyles.linkText}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
