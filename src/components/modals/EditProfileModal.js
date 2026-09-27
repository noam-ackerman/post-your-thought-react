import React, { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsersCtx } from "@/context/UsersContext";
import { OvalLargeThumbnail } from "@/primitives/spinners";
import { Heading, FormField, Button, Modal } from "@/atoms";
import modalStyles from "@/style-modules/components/modals.module.css";

export function EditProfileModal({ toggleModal }) {
  const { UpdateProfile } = useAuth();
  const { updateUserDatabase, currentUserData, uploadImageToStorageAndGetUrl } =
    useUsersCtx();
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInput = useRef();
  const nicknameInput = useRef();
  const bioInput = useRef();

  async function handleImageUpload(e) {
    setLoading(true);
    setError("");
    const [file] = e.target.files;
    if (file) {
      if (file.size <= 3145728) {
        try {
          const imageURL = await uploadImageToStorageAndGetUrl(file);
          setImgUrl(imageURL);
        } catch {
          setError("Failed to upload Image!");
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError("Image is too large! Max size is 3MB");
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const thereIsImage = fileInput.current.value !== "";
    if (nicknameInput.current.value.length > 20) {
      setLoading(false);
      setError("Username is too long! Max 20 characters");
      return;
    }
    try {
      if (thereIsImage) {
        await UpdateProfile({
          displayName: nicknameInput.current.value,
          photoURL: imgUrl,
        });
        await updateUserDatabase({
          displayName: nicknameInput.current.value,
          photoURL: imgUrl,
          bio: bioInput.current.value,
        });
      } else {
        await UpdateProfile({
          displayName: nicknameInput.current.value,
        });
        await updateUserDatabase({
          displayName: nicknameInput.current.value,
          bio: bioInput.current.value,
        });
      }
      toggleModal();
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  React.useLayoutEffect(() => {
    setImgUrl(currentUserData.photoURL);
  }, [currentUserData.photoURL]);

  return (
    <Modal onClose={toggleModal}>
      <Heading level="secondary">Update Profile</Heading>
      <form className={modalStyles.form} onSubmit={handleSubmit}>
        {error && <div className={modalStyles.formError}>{error}</div>}
        <div className={modalStyles.inputGroup}>
          <div className={modalStyles.profileImgModalWrapper}>
            {loading && <OvalLargeThumbnail />}
            <img
              className={modalStyles.profileImg}
              src={imgUrl}
              alt={currentUserData.displayName}
              onLoad={() => setLoading(false)}
            />
          </div>
          <label
            htmlFor="fileInputTag"
            className={modalStyles.selectImageButton}
            disabled={loading}
          >
            Select an Image file{" "}
            <span className={modalStyles.maxSize}>(max 3MB)</span>
            <input
              id="fileInputTag"
              type="file"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              multiple={false}
              ref={fileInput}
              className={modalStyles.input}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <FormField
          styles={modalStyles}
          label="Nickname:"
          ref={nicknameInput}
          type="text"
          name="nickname"
          defaultValue={currentUserData.displayName}
          required
        />
        <FormField
          styles={modalStyles}
          label="Bio:"
          as="textarea"
          ref={bioInput}
          className={modalStyles.textArea}
          name="bio"
          defaultValue={currentUserData.bio}
        />
        <Button
          variant="submit"
          styles={modalStyles}
          type="submit"
          disabled={loading}
        >
          Update
        </Button>
      </form>
    </Modal>
  );
}
