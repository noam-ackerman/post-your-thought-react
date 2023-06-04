import React, { useRef, useState } from "react";
import { uid } from "uid";
import styles from "../../style-modules/style.module.css";
import { useUsersCtx } from "../../context/usersContext";

export default function PostingForm() {
  const { updateUserDatabase, currentUserData } = useUsersCtx();
  const textArea = useRef();
  const [error, setError] = useState(null);

  async function addingPostFromForm(newPostData) {
    let posts = currentUserData.posts ? currentUserData.posts : [];
    try {
      await updateUserDatabase({ posts: [newPostData, ...posts] });
      textArea.current.value = "";
    } catch {
      setError("Something went wrong!");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let newPostData = {
      id: uid(32),
      content: textArea.current.value,
      date: Date.now(),
    };
    addingPostFromForm(newPostData);
  }
  return (
    <div className={styles.postingFormWrraper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        style={{ gap: "1.6rem" }}
      >
        <textarea
          className={styles.textArea}
          required
          ref={textArea}
          placeholder="Post your thought here..."
        />
        <div className={styles.postFormActionWrapper}>
          {error && <div className={styles.postFormError}>{error}</div>}
          <button className={styles.postSubmitbutton} type="submit">
            Post
          </button>
        </div>
      </form>
    </div>
  );
}
