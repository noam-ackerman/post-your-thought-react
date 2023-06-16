import React, { useRef, useState } from "react";
import styles from "../../style-modules/style.module.css";
import { useAuth } from "../../context/AuthContext";
import { useUsersCtx } from "../../context/usersContext";
import { Oval } from "react-loader-spinner";
import { ExitSVG } from "../resources/logos";

export default function EditProfileModal(props) {
  const { UpdateProfile } = useAuth();
  const { updateUserDatabase, currentUserData, UploadImageToStorageAndGetUrl } =
    useUsersCtx();
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const modal = useRef();
  const fileInput = useRef();
  const nicknameInput = useRef();
  const bioInput = useRef();

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
    setError("");
    const [file] = e.target.files;
    if (file) {
      if (file.size <= 3145728) {
        try {
          const imageURL = await UploadImageToStorageAndGetUrl(file);
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
      props.toggleModalOpen();
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
                  wrapperClass={styles.ovalThumbnail}
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
                alt={currentUserData.displayName}
                onLoad={() => setLoading(false)}
              />
            </div>
            <label
              htmlFor="fileInputTag"
              className={styles.selectImageButton}
              disabled={loading}
            >
              Select an Image file{" "}
              <span className={styles.maxSize}>(max 3MB)</span>
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
              defaultValue={currentUserData.displayName}
              ref={nicknameInput}
              required
            />
          </div>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Bio:</label>
            <textarea
              className={styles.textAreaSmall}
              type="text"
              name="bio"
              defaultValue={currentUserData.bio}
              ref={bioInput}
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
