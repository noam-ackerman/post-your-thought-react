import React, { useState } from "react";
import styles from "../../style-modules/style.module.css";

export default function PostBlockUnauthenticated(props) {
  let date = new Date(props.post.date);
  let year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={styles.postBlockWrraper}>
      <div className={styles.postInfoLineWrapper}>
        <div className={styles.profileImgThumbnailWrapper}>
          <img
            className={styles.profileImgThumbnail}
            src={props.user.photoURL}
            alt={props.user.displayName}
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className={styles.usernamePost}>{props.user.displayName}</div>
        <div className={styles.dateAndTime}>{time}</div>
      </div>

      <div className={styles.postContent}>{props.post.content}</div>
    </div>
  );
}
