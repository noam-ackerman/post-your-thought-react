import { useRef, useState, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Heading, FormField, Button } from "@/components/atoms";
import { firebaseErrorCode } from "@/utilities/firebaseError";
import { loginSchema } from "@/schemas/auth";
import { useFormValidation } from "@/utilities/customHooks/useFormValidation";
import authStyles from "@/style-modules/pages/authPage.module.css";

export function Login() {
  const { LoginUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const { fieldErrors, validate, revalidateIfAttempted } = useFormValidation(loginSchema);

  function getValues() {
    return {
      email: emailInput.current!.value,
      password: passwordInput.current!.value,
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const result = validate(getValues());
    if (result.errors) return;
    try {
      setLoading(true);
      await LoginUser(result.data.email, result.data.password);
      navigate("/");
    } catch (err) {
      const code = firebaseErrorCode(err);
      if (code === "auth/user-not-found" || code === "auth/wrong-password") {
        setError("Email/Password are incorrect.");
      } else if (code === "auth/too-many-requests") {
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
        <form
          className={authStyles.form}
          onSubmit={handleSubmit}
          onInput={() => revalidateIfAttempted(getValues())}
          noValidate
        >
          {error && <div className={authStyles.error}>{error}</div>}
          <FormField
            label="Email"
            ref={emailInput}
            type="email"
            name="email"
            autoComplete="email"
            error={fieldErrors.email}
          />
          <FormField
            label="Password"
            ref={passwordInput}
            type="password"
            autoComplete="current-password"
            name="password"
            error={fieldErrors.password}
          />
          <Button color="pink" shape="fullWidth" type="submit" loading={loading}>
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
