import React, { useRef } from "react";
import styles from "../../style-modules/style.module.css";

export default function PostingForm(props) {
  const textArea = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    let newPostData = {
      id: Math.random().toString(),
      content: textArea.current.value,
      date: Date.now(),
      likes: 0,
    };
    props.addingPostFromForm(newPostData);
    textArea.current.value = "";
  }
  return (
    <div className={styles.postingFormWrraper}>
      <form className={styles.form} onSubmit={handleSubmit}>
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
