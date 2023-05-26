import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import styles from "../style-modules/style.module.css";

export default function Signup() {
  const { SignupUser } = useAuth();
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const passwordConfirmInput = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

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
    <div className={styles.AuthContainer}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={styles.cardPrimary}>
        <div className={styles.SecondaryTitle}>Sign Up</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.formError}>{error}</div>}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Email</label>
            <input
              className={styles.input}
              type="email"
              ref={emailInput}
              name="email"
              autoComplete="email"
              placeholder="example@example.com"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <input
              className={styles.input}
              type="password"
              ref={passwordInput}
              name="password"
              placeholder="=< 6 characters"
              autoComplete="new-password"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password Confirmation</label>
            <input
              className={styles.input}
              type="password"
              ref={passwordConfirmInput}
              name="password-confirmation"
              placeholder="=< 6 characters"
              autoComplete="off"
              required
            />
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading && (
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
            )}
            <span style={{ opacity: loading && "0" }}>Sign Up</span>
          </button>
        </form>
      </div>
      <div className={styles.linkText}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
