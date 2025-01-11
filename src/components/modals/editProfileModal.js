import React, { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useUsersCtx } from "../../context/usersContext";
import { OvalLargeThumbnail } from "../../utilities/spinners";
import { ExitSVG } from "../../utilities/icons";
import styles from "../../style-modules/global.module.css";
import modalStyles from "../../style-modules/components/modals.module.css";

export default function EditProfileModal({ toggleModal }) {
  const { UpdateProfile } = useAuth();
  const { updateUserDatabase, currentUserData, uploadImageToStorageAndGetUrl } =
    useUsersCtx();
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const modal = useRef();
  const fileInput = useRef();
  const nicknameInput = useRef();
  const bioInput = useRef();

  function handleOverlayClick(event) {
    if (event.target !== modal.current) toggleModal();
  }

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
    <>
      <div
        className={modalStyles.modalOverlay}
        onClick={handleOverlayClick}
      ></div>
      <div ref={modal} className={modalStyles.modalCard}>
        <button className={modalStyles.exitBtn} onClick={toggleModal}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={styles.SecondaryTitle}>Update Profile</div>
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
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>Nickname:</label>
            <input
              className={modalStyles.input}
              type="text"
              name="nickname"
              defaultValue={currentUserData.displayName}
              ref={nicknameInput}
              required
            />
          </div>
          <div className={modalStyles.inputGroup}>
            <label className={modalStyles.inputLabel}>Bio:</label>
            <textarea
              className={modalStyles.textArea}
              type="text"
              name="bio"
              defaultValue={currentUserData.bio}
              ref={bioInput}
            />
          </div>
          <button
            className={modalStyles.submitButton}
            type="submit"
            disabled={loading}
          >
            Update
          </button>
        </form>
      </div>
    </>
  );
}
