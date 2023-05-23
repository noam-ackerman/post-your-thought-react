import React, { useRef, useState } from "react";
import { Oval } from "react-loader-spinner";
import styles from "../../style-modules/style.module.css";

export default function ProfileBlockUnauthenticated(props) {
  const user = props.user;
  const [imageLoaded, setImageLoaded] = useState(false);
  const profileImg = useRef();
  

  return (
    <div className={styles.profileBlockWrapper}>
      <div className={styles.profileImageWrapper} style={{ cursor: "default" }}>
        {!imageLoaded && (
          <Oval
            height={138}
            width={138}
            color="#B5A1FF"
            wrapperStyle={{}}
            wrapperClass={styles.ovalProfileImage}
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#B5A1FF"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
        )}
        <img
          ref={profileImg}
          style={{ display: imageLoaded ? "block" : "none" }}
          src={user.photoURL}
          onLoad={() => setImageLoaded(true)}
          alt={user.displayName}
          className={styles.profileImage}
        />
      </div>
      <div className={styles.profileDetailsWrapper}>
        <div className={styles.detailProfile}>
          <span className={styles.detailLabel}>Username:</span>
          <span className={styles.detailTitle}>{user.displayName}</span>
        </div>
        {user.bio && (
          <div className={styles.detailProfile}>
            <span className={styles.detailLabel}>Bio:</span>
            <span className={styles.detailTitle}>{user.bio}</span>
          </div>
        )}
      </div>
    </div>
  );
}
