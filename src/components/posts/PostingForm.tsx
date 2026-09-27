import { useRef, useState, type SubmitEvent } from "react";
import { uid } from "uid";
import { useUsersCtx } from "@/context/UsersContext";
import { useToggleModal } from "@/utilities/customHooks/useToggleModal";
import { KaomojiesModal } from "@/components/modals/KaomojiesModal";
import { Button } from "@/components/atoms";
import styles from "@/style-modules/global.module.css";
import postsStyles from "@/style-modules/components/posts.module.css";
import type { PostRecord } from "@/types";

export function PostingForm() {
  const { updatePost, currentUserData } = useUsersCtx();
  const textArea = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, toggleModal] = useToggleModal();

  function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const newPostData: PostRecord = {
      postId: uid(32),
      content: textArea.current!.value,
      date: Date.now(),
      userId: currentUserData!.userId,
    };
    updatePost(newPostData.postId, newPostData)
      .then(() => {
        textArea.current!.value = "";
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }

  return (
    <div className={postsStyles.formWrapper}>
      <form className={postsStyles.form} onSubmit={handleSubmit}>
        <textarea
          className={postsStyles.textArea}
          required
          ref={textArea}
          placeholder="Post your thought here..."
        />
        <div
          className={`${styles.actionWrapper} ${styles.marginTopBottom0} ${styles.fullWidth}`}
        >
          {error && <div className={postsStyles.error}>{error}</div>}
          <div className={`${styles.actionWrapper} ${styles.marginTopBottom0}`}>
            <Button color="info" shape="compact" type="button" onClick={toggleModal}>
              Kaomojies
            </Button>
            <Button color="pink" shape="compact" type="submit">
              Post
            </Button>
          </div>
        </div>
      </form>
      {modalOpen && <KaomojiesModal toggleModal={toggleModal} />}
    </div>
  );
}
