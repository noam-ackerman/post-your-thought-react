import { useRef, useState, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Heading, FormField, Button } from "@/components/atoms";
import { firebaseErrorCode } from "@/utilities/firebaseError";
import { signupSchema } from "@/schemas/auth";
import { useFormValidation } from "@/utilities/customHooks/useFormValidation";
import authStyles from "@/style-modules/pages/authPage.module.css";

export function Signup() {
  const { SignupUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const passwordConfirmInput = useRef<HTMLInputElement>(null);
  const { fieldErrors, validate, revalidateIfAttempted } = useFormValidation(signupSchema);

  function getValues() {
    return {
      email: emailInput.current!.value,
      password: passwordInput.current!.value,
      passwordConfirmation: passwordConfirmInput.current!.value,
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const result = validate(getValues());
    if (result.errors) return;
    try {
      setLoading(true);
      await SignupUser(result.data.email, result.data.password);
      navigate("/");
    } catch (err) {
      const code = firebaseErrorCode(err);
      if (code === "auth/invalid-email") {
        setError("Failed to sign up! Invalid email.");
      } else if (code === "auth/weak-password") {
        setError("Password must be at least 6 characters long");
      } else if (code === "auth/email-already-in-use") {
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
      <Heading level="main">Post Your Thought.</Heading>
      <div className={authStyles.card}>
        <Heading level="secondary">Sign Up</Heading>
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
            placeholder="example@example.com"
            error={fieldErrors.email}
          />
          <FormField
            label="Password"
            ref={passwordInput}
            type="password"
            name="password"
            placeholder="=< 6 characters"
            autoComplete="new-password"
            error={fieldErrors.password}
          />
          <FormField
            label="Password Confirmation"
            ref={passwordConfirmInput}
            type="password"
            name="password-confirmation"
            placeholder="=< 6 characters"
            autoComplete="off"
            error={fieldErrors.passwordConfirmation}
          />
          <Button color="pink" shape="fullWidth" type="submit" loading={loading}>
            Sign Up
          </Button>
        </form>
      </div>
      <div className={authStyles.linkText}>
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
}
