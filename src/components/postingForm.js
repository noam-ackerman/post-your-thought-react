import React, { useRef, useState } from "react";
import ReactDOM from "react-dom";
import { uid } from "uid";
import { useUsersCtx } from "../context/usersContext";
import KaomojiesModal from "./modals/KaomojiesModal";
import styles from "../style-modules/style.module.css";

export default function PostingForm() {
  const { updatePost, currentUserData } = useUsersCtx();
  const textArea = useRef();
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  function toggleKaomojiesModal() {
    setModalOpen(!modalOpen);
  }

  React.useEffect(() => {
    modalOpen
      ? document.querySelector("body").classList.add("modal-open")
      : document.querySelector("body").classList.remove("modal-open");
  }, [modalOpen]);

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
          <div className={styles.buttonsFlex}>
            <button
              className={styles.postSubmitbutton}
              type="button"
              onClick={toggleKaomojiesModal}
              style={{ backgroundColor: "#8cb4fe" }}
            >
              Kaomojies
            </button>
            <button className={styles.postSubmitbutton} type="submit">
              Post
            </button>
          </div>
        </div>
      </form>
      {modalOpen &&
        ReactDOM.createPortal(
          <KaomojiesModal toggleModal={toggleKaomojiesModal} />,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
