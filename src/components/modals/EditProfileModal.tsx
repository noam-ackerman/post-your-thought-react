import { useLayoutEffect, useRef, useState, type ChangeEvent, type SubmitEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsersCtx } from "@/context/UsersContext";
import { Heading, FormField, Button, Modal, OvalLargeThumbnail } from "@/components/atoms";
import { editProfileSchema } from "@/schemas/profile";
import { useFormValidation } from "@/utilities/customHooks/useFormValidation";
import modalStyles from "@/style-modules/components/modals.module.css";

interface EditProfileModalProps {
  toggleModal: () => void;
}

export function EditProfileModal({ toggleModal }: EditProfileModalProps) {
  const { UpdateProfile } = useAuth();
  const { updateUserDatabase, currentUserData, uploadImageToStorageAndGetUrl } =
    useUsersCtx();
  const [error, setError] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInput = useRef<HTMLInputElement>(null);
  const nicknameInput = useRef<HTMLInputElement>(null);
  const bioInput = useRef<HTMLTextAreaElement>(null);
  const { fieldErrors, validate, revalidateIfAttempted } = useFormValidation(
    editProfileSchema
  );

  function getValues() {
    return {
      nickname: nicknameInput.current!.value,
      bio: bioInput.current!.value,
    };
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    setLoading(true);
    setError("");
    const file = e.target.files?.[0];
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

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const result = validate(getValues());
    if (result.errors) return;
    setLoading(true);
    const thereIsImage = fileInput.current!.value !== "";
    try {
      if (thereIsImage) {
        await UpdateProfile({
          displayName: result.data.nickname,
          photoURL: imgUrl,
        });
        await updateUserDatabase({
          displayName: result.data.nickname,
          photoURL: imgUrl,
          bio: result.data.bio,
        });
      } else {
        await UpdateProfile({
          displayName: result.data.nickname,
        });
        await updateUserDatabase({
          displayName: result.data.nickname,
          bio: result.data.bio,
        });
      }
      toggleModal();
    } catch {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  useLayoutEffect(() => {
    setImgUrl(currentUserData!.photoURL);
  }, [currentUserData!.photoURL]);

  return (
    <Modal onClose={toggleModal}>
      <Heading level="secondary">Update Profile</Heading>
      <form
        className={modalStyles.form}
        onSubmit={handleSubmit}
        onInput={() => revalidateIfAttempted(getValues())}
        noValidate
      >
        {error && <div className={modalStyles.formError}>{error}</div>}
        <div className={modalStyles.inputGroup}>
          <div className={modalStyles.profileImgModalWrapper}>
            {loading && <OvalLargeThumbnail />}
            <img
              className={modalStyles.profileImg}
              src={imgUrl}
              alt={currentUserData!.displayName}
              onLoad={() => setLoading(false)}
            />
          </div>
          <label htmlFor="fileInputTag" className={modalStyles.selectImageButton}>
            Select an Image file{" "}
            <span className={modalStyles.maxSize}>(max 3MB)</span>
            <input
              id="fileInputTag"
              type="file"
              accept="image/png, image/jpg, image/gif, image/jpeg"
              multiple={false}
              ref={fileInput}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <FormField
          label="Nickname:"
          ref={nicknameInput}
          type="text"
          name="nickname"
          defaultValue={currentUserData!.displayName}
          error={fieldErrors.nickname}
        />
        <FormField
          label="Bio:"
          as="textarea"
          ref={bioInput}
          name="bio"
          defaultValue={currentUserData!.bio}
        />
        <Button color="pink" shape="fullWidth" type="submit" disabled={loading}>
          Update
        </Button>
      </form>
    </Modal>
  );
}
