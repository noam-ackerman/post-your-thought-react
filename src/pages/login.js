import React, { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
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
              autoComplete="email"
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Password</label>
            <input
              className={styles.input}
              type="password"
              ref={passwordInput}
              autoComplete="current-password"
              name="password"
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
            <span style={{ opacity: loading && "0" }}>Login</span>
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
