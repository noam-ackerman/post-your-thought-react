import { useRef, useState, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { Heading, FormField, Button } from "@/atoms";
import authStyles from "@/style-modules/pages/authPage.module.css";

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const emailInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await resetPassword(emailInput.current!.value);
      setMessage("Check your inbox for further instructions!");
    } catch {
      setError("Failed to reset password!");
    }
    setLoading(false);
  }

  return (
    <div className={authStyles.container}>
      <Heading level="main">Post Your Thought.</Heading>
      <div className={authStyles.card}>
        <Heading level="secondary">Reset Password</Heading>
        <form className={authStyles.form} onSubmit={handleSubmit}>
          {error && <div className={authStyles.error}>{error}</div>}
          {message && <div className={authStyles.message}>{message}</div>}
          <FormField
            styles={authStyles}
            label="Email"
            ref={emailInput}
            type="email"
            name="email"
            autoComplete="email"
            placeholder="example@example.com"
            required
          />
          <Button color="pink" shape="fullWidth" type="submit" loading={loading}>
            Reset Password
          </Button>
        </form>
        <div className={authStyles.linkText}>
          <Link to="/login">Log in</Link>
        </div>
      </div>
    </div>
  );
}
