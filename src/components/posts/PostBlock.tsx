import { useRef, useState } from "react";
import { useUsersCtx } from "@/context/UsersContext";
import { Link } from "react-router-dom";
import { formatDate, handleLike } from "@/utilities/actions";
import {
  Avatar,
  Button,
  EmptyHeartSVG,
  FullHeartSVG,
  EditSVG,
  CheckSVG,
  TrashSVG,
  XmarkSVG,
} from "@/components/atoms";
import { useLongPost } from "@/utilities/customHooks/useLongPost";
import { useToggleBtnClick } from "@/utilities/customHooks/useToggleButtonClick";
import styles from "@/style-modules/global.module.css";
import postsStyles from "@/style-modules/components/posts.module.css";
import type { PostRecord, UserRecord } from "@/types";

interface PostBlockProps {
  post: PostRecord;
  author: UserRecord | undefined;
  canEdit: boolean;
}

export function PostBlock({ post, author, canEdit }: PostBlockProps) {
  const time = formatDate(post.date);
  const { updatePost, removePost, currentUserData } = useUsersCtx();
  const [editMode, setEditMode] = useState(false);
  const heart = useRef<HTMLDivElement>(null);
  const postContentWrapper = useRef<HTMLDivElement>(null);
  const postContent = useRef<HTMLDivElement>(null);
  const deletePostBtn = useRef<HTMLButtonElement>(null);
  const textAreaEdit = useRef<HTMLTextAreaElement>(null);

  const [btnClickedOnce, setBtnClickedOnce] = useToggleBtnClick(deletePostBtn);
  const [longPost, showMorePost, setShowMorePost, handleShowMore] = useLongPost(
    canEdit && editMode,
    post.content,
    postContent,
    postContentWrapper
  );

  const postLikes = post.likes ? post.likes : [];
  const postIsLikedByCurrentUser = postLikes.includes(currentUserData!.userId);

  async function handleDeletePost() {
    if (!btnClickedOnce) {
      setBtnClickedOnce(true);
      return;
    } else {
      removePost(post.postId).catch(() => alert("Something went wrong!"));
      setBtnClickedOnce(false);
    }
  }

  function handleEditPost() {
    if (!editMode) {
      setEditMode(true);
      if (showMorePost) setShowMorePost(false);
    } else {
      let newContent = textAreaEdit.current!.value;
      if (textAreaEdit.current!.value.trim() === "") return;
      updatePost(post.postId, { content: newContent }).catch(() =>
        alert("Something went wrong!")
      );
      setEditMode(false);
    }
  }

  return (
    <div className={postsStyles.postBlockWrraper}>
      <div className={postsStyles.postInfoLineWrapper}>
        <div className={postsStyles.userInfo}>
          <Avatar
            to={`/${author?.userId}`}
            src={author?.photoURL}
            alt={author?.displayName}
          />
          <Link to={`/${author?.userId}`} className={postsStyles.usernamePost}>
            {author?.displayName}
          </Link>
        </div>
        <div className={postsStyles.dateAndTime}>{time}</div>
      </div>
      {canEdit && editMode ? (
        <textarea
          className={`${postsStyles.textArea} ${styles.marginTopBottom1}`}
          required
          ref={textAreaEdit}
          defaultValue={post.content}
        />
      ) : (
        <div className={postsStyles.postWrapper}>
          <div
            ref={postContentWrapper}
            className={postsStyles.postContent}
            style={{ maxHeight: longPost && showMorePost ? "max-content" : undefined }}
          >
            <div ref={postContent}>{post.content}</div>
          </div>
          {longPost && (
            <>
              {!showMorePost && <div style={{ color: "#7c606b" }}>...</div>}
              <div className={postsStyles.showMoreBtn} onClick={handleShowMore}>
                {showMorePost ? "Show less" : "Show more"}
              </div>
            </>
          )}
        </div>
      )}
      <div className={styles.actionWrapper}>
        <div className={postsStyles.likeWrapper}>
          <div
            ref={heart}
            onClick={() =>
              handleLike(
                heart,
                postLikes,
                currentUserData!.userId,
                post.postId,
                updatePost
              )
            }
            data-action={postIsLikedByCurrentUser ? "unlike" : "like"}
            style={{
              cursor:
                "url(https://cur.cursors-4u.net/nature/nat-10/nat997.cur), auto",
            }}
          >
            {postIsLikedByCurrentUser ? (
              <FullHeartSVG color="var(--color-heart-liked)" height="24px" width="24px" />
            ) : (
              <EmptyHeartSVG color="var(--color-black)" height="24px" width="24px" />
            )}
          </div>
          <span className={styles.preventHighlightSelect}>
            {postLikes.length}
          </span>
        </div>
        {canEdit && (
          <>
            {editMode && (
              <Button
                color="info"
                onClick={() => setEditMode(false)}
                title="Cancel"
                aria-label="Cancel edit"
              >
                <XmarkSVG color="var(--color-white)" height="20px" width="20px" />
              </Button>
            )}{" "}
            <Button
              onClick={handleEditPost}
              title={editMode ? "Save changes" : "Edit post"}
              aria-label={editMode ? "Save changes" : "Edit post"}
            >
              {editMode ? (
                <CheckSVG color="var(--color-white)" height="20px" width="20px" />
              ) : (
                <EditSVG color="var(--color-white)" height="20px" width="20px" />
              )}
            </Button>{" "}
            <Button
              color="danger"
              ref={deletePostBtn}
              onClick={handleDeletePost}
              title={btnClickedOnce ? "Confirm delete" : "Delete post"}
              aria-label={btnClickedOnce ? "Confirm delete" : "Delete post"}
            >
              <span className={postsStyles.deleteConfirmContent}>
                <TrashSVG color="var(--color-white)" height="20px" width="20px" />
                {btnClickedOnce && "Sure?"}
              </span>
            </Button>{" "}
          </>
        )}
      </div>
    </div>
  );
}
