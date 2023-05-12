import React, { useRef, useState } from "react";
import styles from "../style-modules/style.module.css";
// import { useAuth } from "../context/AuthContext";

export default function PostBlock(props) {
  const textAreaEdit = useRef();
  const [editMode, setEditMode] = useState(false);
  let date = new Date(props.post.date);
  let year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleDeletePost() {
    props.deletePost(props.post);
  }

  function handleEditPost() {
    if (!editMode) {
      setEditMode(true);
    }
    if (editMode) {
      let newContent = textAreaEdit.current.value;
      setEditMode(false);
      props.editPost(props.post, newContent);
    }
  }

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
      {editMode ? (
        <textarea
          className={`${styles.textArea} ${styles.marginTopBottom1}`}
          required
          ref={textAreaEdit}
          defaultValue={props.post.content}
        />
      ) : (
        <div className={styles.postContent}>{props.post.content}</div>
      )}
      <div className={styles.actionWrapper}>
        <button className={styles.actionButtonPrimary} onClick={handleEditPost}>
          {editMode ? "Save" : "Edit"}
        </button>{" "}
        <button
          className={styles.actionButtonPrimary}
          onClick={handleDeletePost}
        >
          Delete
        </button>{" "}
      </div>
    </div>
  );
}
