import { useState, useRef, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsersCtx } from "@/context/UsersContext";
import { useNavigate } from "react-router-dom";
import { Heading, FormField, Button, Modal } from "@/atoms";
import { firebaseErrorCode } from "@/utilities/firebaseError";
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
  const [deleteClick, setDeleteClick] = useState(false);
  const navigate = useNavigate();

  const emailInput = useRef<HTMLInputElement>(null);
  const oldPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordInput = useRef<HTMLInputElement>(null);
  const newPasswordConfirmInput = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await reAuthenticateUser(oldPasswordInput.current!.value);
      if (
        newPasswordInput.current!.value !== newPasswordConfirmInput.current!.value
      ) {
        return setError("Passwords do not match!");
      }
      if (emailInput.current!.value !== currentUser!.email) {
        try {
          await UpdateEmail(emailInput.current!.value);
        } catch (err) {
          if (firebaseErrorCode(err) === "auth/invalid-email") {
            return setError("Failed to update! Invalid email.");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      if (newPasswordInput.current!.value) {
        try {
          await UpdatePassword(newPasswordInput.current!.value);
        } catch (err) {
          if (firebaseErrorCode(err) === "auth/weak-password") {
            setError("Password must be at least 6 characters long");
          } else {
            return setError("Failed to update settings");
          }
        }
      }
      setMessage("Your setting were updated!");
    } catch {
      return setError("Failed! Incorrent password");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    setError("");
    setMessage("");
    if (!oldPasswordInput.current!.checkValidity()) {
      oldPasswordInput.current!.reportValidity();
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
        backgroundColor: deleting ? "#c1f7dc" : undefined,
        opacity: deleting ? 1 : undefined,
      }}
    >
      <Heading level="secondary">Update Settings</Heading>
      <form className={modalStyles.form} onSubmit={handleSubmit}>
        {error && <div className={modalStyles.formError}>{error}</div>}
        {message && <div className={modalStyles.formMessage}>{message}</div>}
        <FormField
          styles={modalStyles}
          label="Email"
          ref={emailInput}
          type="email"
          name="email"
          autoComplete="email"
          defaultValue={currentUser!.email ?? ""}
          required
        />
        <FormField
          styles={modalStyles}
          label="Old Password"
          ref={oldPasswordInput}
          type="password"
          name="old-password"
          autoComplete="current-password"
          placeholder="Required for update"
          required
        />
        <FormField
          styles={modalStyles}
          label="New Password"
          ref={newPasswordInput}
          type="password"
          autoComplete="new-password"
          name="password"
          placeholder="Leave blank to keep"
        />
        <FormField
          styles={modalStyles}
          label="New Password Confirmation"
          ref={newPasswordConfirmInput}
          type="password"
          autoComplete="off"
          name="password-confirmation"
          placeholder="Leave blank to keep"
        />
        <div className={modalStyles.settingsActions}>
          <Button color="pink" shape="fullWidth" type="submit" loading={loading}>
            Update
          </Button>
          <Button
            color="danger"
            shape="fullWidth"
            style={{ marginTop: 0 }}
            onClick={handleDeleteUser}
            disabled={loading}
            type="button"
          >
            {!deleteClick ? "Delete My Account" : "Are you sure? 'Yes'"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
