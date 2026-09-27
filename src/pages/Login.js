import React, { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Heading, FormField, Button } from "@/atoms";
import authStyles from "@/style-modules/pages/authPage.module.css";

export function Login() {
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
      <Heading level="main">Post Your Thought.</Heading>
      <div className={authStyles.card}>
        <Heading level="secondary">Login</Heading>
        <form className={authStyles.form} onSubmit={handleSubmit}>
          {error && <div className={authStyles.error}>{error}</div>}
          <FormField
            styles={authStyles}
            label="Email"
            ref={emailInput}
            type="email"
            name="email"
            autoComplete="email"
            required
          />
          <FormField
            styles={authStyles}
            label="Password"
            ref={passwordInput}
            type="password"
            autoComplete="current-password"
            name="password"
            required
          />
          <Button
            variant="submit"
            styles={authStyles}
            type="submit"
            loading={loading}
          >
            Login
          </Button>
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
