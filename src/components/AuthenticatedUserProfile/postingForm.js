import React, { useRef } from "react";
import { uid } from "uid";
import styles from "../../style-modules/style.module.css";

export default function PostingForm(props) {
  const textArea = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    let newPostData = {
      id: uid(32),
      content: textArea.current.value,
      date: Date.now(),
    };
    props.addingPostFromForm(newPostData);
    textArea.current.value = "";
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
        <button
          className={styles.postSubmitbutton}
          type="submit"
          // disabled={loading}
        >
          Post
        </button>
      </form>
    </div>
  );
}
