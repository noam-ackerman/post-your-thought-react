import { useState } from "react";
import { XmarkSVG, OvalContainer } from "@/components/atoms";
import modalStyles from "@/style-modules/components/modals.module.css";

interface ProfileImageProps {
  toggleModal: () => void;
  username: string | undefined;
  img: string | undefined;
}

export function ProfileImage({ toggleModal, username, img }: ProfileImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={modalStyles.profileImageModal}>
      <button
        className={`${modalStyles.exitBtn} ${modalStyles.exitBtnBackground}`}
        onClick={toggleModal}
      >
        <XmarkSVG color="var(--color-plum)" height="24px" width="24px" />
      </button>
      {!imageLoaded && <OvalContainer />}
      <img
        src={img}
        alt={username}
        className={modalStyles.profileImageElement}
        style={{ display: imageLoaded ? "block" : "none" }}
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
