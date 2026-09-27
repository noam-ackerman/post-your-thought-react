import { useState, useRef, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsersCtx } from "@/context/UsersContext";
import { useNavigate } from "react-router-dom";
import { Heading, FormField, Button, Modal } from "@/components/atoms";
import { firebaseErrorCode } from "@/utilities/firebaseError";
import { useToggleBtnClick } from "@/utilities/customHooks/useToggleButtonClick";
import { updateSettingsSchema } from "@/schemas/profile";
import { useFormValidation } from "@/utilities/customHooks/useFormValidation";
import modalStyles from "@/style-modules/components/modals.module.css";

interface UpdateSettingsModalProps {
  toggleModal: () => void;
}

export function UpdateSettingsModal({ toggleModal }: UpdateSettingsModalProps) {
  const {
    currentUser,
    UpdateEmail,
    UpdatePassword,
    DeleteUser,
    reAuthenticateUser,
  } = useAuth();
  const {
    currentUserData,
    deleteUserDatabase,
    deleteStorageUser,
    postsData,
    removePost,
  } = useUsersCtx();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const emailInput = useRef<HTMLInputElement>(null);
  const oldPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordConfirmInput = useRef<HTMLInputElement>(null);
  const deleteBtn = useRef<HTMLButtonElement>(null);
  const [deleteClick, setDeleteClick] = useToggleBtnClick(deleteBtn);
  const { fieldErrors, setFieldErrors, validate, revalidateIfAttempted } =
    useFormValidation(updateSettingsSchema);

  function getValues() {
    return {
      email: emailInput.current!.value,
      oldPassword: oldPasswordInput.current!.value,
      newPassword: newPasswordInput.current!.value,
      newPasswordConfirmation: newPasswordConfirmInput.current!.value,
    };
  }

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const result = validate(getValues());
    if (result.errors) return;
    setLoading(true);
    try {
      await reAuthenticateUser(result.data.oldPassword);
      if (result.data.email !== currentUser!.email) {
        try {
          await UpdateEmail(result.data.email);
        } catch (err) {
          if (firebaseErrorCode(err) === "auth/invalid-email") {
            return setError("Failed to update! Invalid email.");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      if (result.data.newPassword) {
        try {
          await UpdatePassword(result.data.newPassword);
        } catch (err) {
          if (firebaseErrorCode(err) === "auth/weak-password") {
            setError("Password must be at least 6 characters long");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      setMessage("Your settings were updated!");
    } catch {
      return setError("Failed! Incorrent password");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    setError("");
    setMessage("");
    if (!oldPasswordInput.current!.value.trim()) {
      setFieldErrors({ oldPassword: "Current password is required" });
      return;
    }
    if (!deleteClick) {
      setDeleteClick(true);
    } else {
      setLoading(true);
      try {
        await reAuthenticateUser(oldPasswordInput.current!.value);
        try {
          setDeleting(true);
          document.body.classList.remove("modal-open");
          document.body.style.top = "";
          const userPosts = Object.values(postsData ?? {}).filter(
            (post) => post.userId === currentUserData!.userId
          );
          userPosts.forEach((post) => {
            removePost(post.postId);
          });
          await deleteUserDatabase();
          await deleteStorageUser();
          await DeleteUser();
          navigate("/login");
        } catch {
          setError("Failed to delete account!");
          setDeleting(false);
          setDeleteClick(false);
        }
      } catch {
        setError("Failed! Incorrent password");
        setDeleteClick(false);
      }
      setLoading(false);
    }
  }

  return (
    <Modal
      onClose={toggleModal}
      overlayStyle={{
        backgroundColor: deleting ? "var(--color-mint)" : undefined,
        opacity: deleting ? 1 : undefined,
      }}
    >
      <Heading level="secondary">Update Settings</Heading>
      <form
        className={modalStyles.form}
        onSubmit={handleSubmit}
        onInput={() => revalidateIfAttempted(getValues())}
        noValidate
      >
        {error && <div className={modalStyles.formError}>{error}</div>}
        {message && <div className={modalStyles.formMessage}>{message}</div>}
        <FormField
          label="Email"
          ref={emailInput}
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={currentUser!.email ?? ""}
          error={fieldErrors.email}
        />
        <FormField
          label="Old Password"
          ref={oldPasswordInput}
          type="password"
          name="old-password"
          autoComplete="current-password"
          placeholder="Required for update"
          error={fieldErrors.oldPassword}
        />
        <FormField
          label="New Password"
          ref={newPasswordInput}
          type="password"
          autoComplete="new-password"
          name="password"
          placeholder="Leave blank to keep"
          error={fieldErrors.newPassword}
        />
        <FormField
          label="New Password Confirmation"
          ref={newPasswordConfirmInput}
          type="password"
          autoComplete="off"
          name="password-confirmation"
          placeholder="Leave blank to keep"
          error={fieldErrors.newPasswordConfirmation}
        />
        <div className={modalStyles.settingsActions}>
          <Button color="pink" shape="fullWidth" type="submit" loading={loading}>
            Update
          </Button>
          <Button
            color="danger"
            shape="fullWidth"
            style={{ marginTop: 0 }}
            ref={deleteBtn}
            onClick={handleDeleteUser}
            disabled={loading}
            type="button"
          >
            {!deleteClick ? "Delete My Account" : "Are you sure?"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
