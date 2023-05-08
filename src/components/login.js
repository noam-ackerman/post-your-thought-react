import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import styles from "../style-modules/style.module.css";

export default function Login() {
  const { LoginUser } = useAuth();
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await LoginUser(emailInput.current.value, passwordInput.current.value);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Failed to Login! User not Found.");
      } else if (err.code === "auth/wrong-password") {
        setError("Failed to Login! Wrong password.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Too Many Failed Logins! try again later.");
      } else {
        setError("Failed to Login!");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.AuthContainer}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={styles.cardPrimary}>
        <div className={styles.SecondaryTitle}>Login</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.formError}>{error}</div>}
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
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <input
              className={styles.input}
              type="password"
              ref={passwordInput}
              name="password"
              placeholder="=<6 characters"
              required
            />
          </div>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            Login
          </button>
        </form>
        <div className={styles.linkText}>
          <Link to="/resetpassword">Forgot Password?</Link>
        </div>
      </div>
      <div className={styles.linkText}>
        Need an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
