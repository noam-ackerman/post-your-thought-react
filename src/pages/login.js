import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { OvalBtn } from "../utilities/spinners";
import styles from "../style-modules/global.module.css";
import authStyles from "../style-modules/pages/authPage.module.css";

export default function Login() {
  const { LoginUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");
  const navigate = useNavigate();
  const emailInput = useRef();
  const passwordInput = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await LoginUser(emailInput.current.value, passwordInput.current.value);
      navigate("/");
    } catch (err) {
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Email/Password are incorrect.");
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
    <div className={authStyles.container}>
      <div className={styles.MainTitle}>Post Your Thought.</div>
      <div className={authStyles.card}>
        <div className={styles.SecondaryTitle}>Login</div>
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
              required
            />
          </div>
          <div className={authStyles.inputGroup}>
            <label className={authStyles.inputLabel}>Password</label>
            <input
              className={authStyles.input}
              type="password"
              ref={passwordInput}
              autoComplete="current-password"
              name="password"
              required
            />
          </div>
          <button
            className={authStyles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading && <OvalBtn />}
            <span style={{ opacity: loading && "0" }}>Login</span>
          </button>
        </form>
        <div className={authStyles.linkText}>
          <Link to="/resetpassword">Forgot Password?</Link>
        </div>
      </div>
      <div className={authStyles.linkText}>
        Need an account? <Link to="/signup">Sign up</Link>
      </div>
    </div>
  );
}
