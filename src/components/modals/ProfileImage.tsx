import { useState } from "react";
import { ExitSVG } from "@/primitives/icons";
import { OvalContainer } from "@/primitives/spinners";
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
        <ExitSVG color="#7c606b" height="23px" width="23px" />
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
