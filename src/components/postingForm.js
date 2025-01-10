import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { uid } from "uid";
import { useUsersCtx } from "../context/usersContext";
import useToggleModal from "../utilities/customHooks/useToggleModal";
import KaomojiesModal from "./modals/KaomojiesModal";
import styles from "../style-modules/global.module.css";
import postsStyles from "../style-modules/components/posts.module.css";

export default function PostingForm() {
  const { updatePost, currentUserData } = useUsersCtx();
  const textArea = useRef();
  const [error, setError] = useState(null);
  const [modalOpen, toggleModal] = useToggleModal();

  function handleSubmit(e) {
    e.preventDefault();
    let newPostData = {
      postId: uid(32),
      content: textArea.current.value,
      date: Date.now(),
      userId: currentUserData.userId,
    };
    updatePost(newPostData.postId, newPostData)
      .then(() => {
        textArea.current.value = "";
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }

  return (
    <div className={postsStyles.formWrapper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        style={{ gap: "1.6rem" }}
      >
        <textarea
          className={postsStyles.textArea}
          required
          ref={textArea}
          placeholder="Post your thought here..."
        />
        <div className={postsStyles.actionsWrapper} style={{ width: "100%" }}>
          {error && <div className={postsStyles.error}>{error}</div>}
          <div className={postsStyles.actionsWrapper}>
            <button
              className={postsStyles.submitButton}
              type="button"
              onClick={toggleModal}
              style={{ backgroundColor: "#8cb4fe" }}
            >
              Kaomojies
            </button>
            <button className={postsStyles.submitButton} type="submit">
              Post
            </button>
          </div>
        </div>
      </form>
      {modalOpen &&
        ReactDOM.createPortal(
          <KaomojiesModal toggleModal={toggleModal} />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
