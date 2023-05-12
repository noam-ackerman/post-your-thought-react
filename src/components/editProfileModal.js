import React, { useRef, useState } from "react";
import styles from "../style-modules/style.module.css";
import { useAuth } from "../context/AuthContext";
import { Oval } from "react-loader-spinner";
import { ExitSVG } from "./logos";

export default function EditProfileModal(props) {
  const {
    currentUser,
    UploadImageToStorageAndGetUrl,
    UpdateProfile,
    defaultAvatarUrl,
    setCurrentUserUpdating,
    currentUserUpdating,
  } = useAuth();
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState(
    currentUser.photoURL ? currentUser.photoURL : defaultAvatarUrl
  );
  const [loading, setLoading] = useState(true);
  const modal = useRef();
  const fileInput = useRef();
  const nicknameInput = useRef();

  function handleOverlayClick(event) {
    if (event.target !== modal.current) {
      props.toggleModalOpen();
    }
  }
  function cancelEdit() {
    props.toggleModalOpen();
  }

  async function handleImageUpload(e) {
    setLoading(true);
    const [file] = e.target.files;
    if (file) {
      try {
        const imageURL = await UploadImageToStorageAndGetUrl(file);
        setImgUrl(imageURL);
      } catch {
        setError("Failed to upload Image!");
        setLoading(false);
      }
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const thereIsImage = fileInput.current.value !== "";
    try {
      if (thereIsImage) {
        await UpdateProfile({
          displayName: nicknameInput.current.value,
          photoURL: imgUrl,
        });
      } else {
        await UpdateProfile({
          displayName: nicknameInput.current.value,
        });
      }
      setCurrentUserUpdating(!currentUserUpdating);
      props.toggleModalOpen();
    } catch (error) {
      setError("Failed to update profile!");
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <div className={styles.modalOverlay} onClick={handleOverlayClick}></div>
      <div ref={modal} className={styles.modalCard}>
        <button className={styles.exitBtn} onClick={cancelEdit}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        <div className={styles.SecondaryTitle}>Update Profile</div>
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.formError}>{error}</div>}
          <div className={styles.inputGroup}>
            <div className={styles.profileImgModalWrapper}>
              {loading && (
                <Oval
                  height={138}
                  width={138}
                  color="#B5A1FF"
                  wrapperStyle={{}}
                  wrapperClass={styles.oval}
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#B5A1FF"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              )}
              <img
                className={styles.profileImgModal}
                src={imgUrl}
                alt={
                  currentUser.displayName
                    ? currentUser.displayName
                    : currentUser.email
                }
                onLoad={() => setLoading(false)}
              />
            </div>
            <label htmlFor="fileInputTag" className={styles.selectImageButton}>
              Select an Image file
              <input
                id="fileInputTag"
                type="file"
                accept="image/png, image/jpg, image/gif, image/jpeg"
                multiple={false}
                ref={fileInput}
                className={styles.input}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </label>
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Nickname:</label>
            <input
              className={styles.input}
              type="text"
              name="nickname"
              defaultValue={
                currentUser.displayName
                  ? currentUser.displayName
                  : currentUser.email.split("@")[0]
              }
              ref={nicknameInput}
              required
            />
          </div>
          <button
            className={styles.submitButton}
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
