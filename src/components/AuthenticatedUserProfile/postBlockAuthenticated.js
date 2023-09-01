import React, { useRef, useState } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../../utilities/logos";
import { formatDate, handleLike } from "../../utilities/actions";
import useLongPost from "../../utilities/customHooks/useLongPost";
import styles from "../../style-modules/style.module.css";

export default function PostBlockAuthenticated(props) {
  const post = props.post;
  const time = formatDate(post.date);
  const { updatePost, removePost, currentUserData } = useUsersCtx();
  const [editMode, setEditMode] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);

  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();
  const deletePostBtn = useRef();
  const textAreaEdit = useRef();

  const [longPost, showMorePost, setShowMorePost, handleShowMore] = useLongPost(
    editMode,
    post.content,
    postContent,
    postContentWrapper
  );

  const postLikes = post.likes ? post.likes : [];
  const postIsLikedByCurrentUser = postLikes.includes(currentUserData.userId);

  async function handleDeletePost() {
    if (!clickedOnce) {
      setClickedOnce(true);
      return;
    } else {
      removePost(post.postId).catch(() => alert("Something went wrong!"));
      setClickedOnce(false);
    }
  }

  function handleEditPost() {
    if (!editMode) {
      setEditMode(true);
      if (showMorePost) setShowMorePost(false);
    } else {
      let newContent = textAreaEdit.current.value;
      if (textAreaEdit.current.value.trim() === "") return;
      updatePost(post.postId, { content: newContent }).catch(() =>
        alert("Something went wrong!")
      );
      setEditMode(false);
    }
  }

  const handleDocumentClick = React.useCallback(
    (e) => {
      if (clickedOnce && e.target !== deletePostBtn.current) {
        setClickedOnce(false);
      }
    },
    [clickedOnce]
  );

  React.useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [handleDocumentClick]);

  return (
    <div className={styles.postBlockWrraper}>
      <div className={styles.postInfoLineWrapper}>
        <div className={styles.userInfo}>
          <Link
            to={`/${currentUserData?.userId}`}
            className={styles.profileImgThumbnailWrapper}
          >
            <img
              className={styles.profileImgThumbnail}
              src={currentUserData?.photoURL}
              alt={currentUserData?.displayName}
              style={{ display: imageLoaded ? "block" : "none" }}
              onLoad={() => setImageLoaded(true)}
            />
          </Link>
          <Link
            to={`/${currentUserData?.userId}`}
            className={styles.usernamePost}
          >
            {currentUserData?.displayName}
          </Link>
        </div>
        <div className={styles.dateAndTime}>{time}</div>
      </div>
      {editMode ? (
        <textarea
          className={`${styles.textArea} ${styles.marginTopBottom1}`}
          required
          ref={textAreaEdit}
          defaultValue={post.content}
        />
      ) : (
        <div className={styles.postWrapper}>
          <div
            ref={postContentWrapper}
            className={styles.postContent}
            style={{ maxHeight: longPost && showMorePost && "max-content" }}
          >
            <div ref={postContent}>{post.content}</div>
          </div>
          {longPost && (
            <>
              {!showMorePost && <div style={{ color: "#7c606b" }}>...</div>}
              <div className={styles.showMoreBtn} onClick={handleShowMore}>
                {showMorePost ? "Show less" : "Show more"}
              </div>
            </>
          )}
        </div>
      )}
      <div className={styles.actionWrapper}>
        <div className={styles.likeWrapper}>
          <div
            ref={heart}
            onClick={() =>
              handleLike(
                heart,
                postLikes,
                currentUserData.userId,
                post.postId,
                updatePost
              )
            }
            action={postIsLikedByCurrentUser ? "unlike" : "like"}
            style={{
              cursor:
                "url(https://cur.cursors-4u.net/nature/nat-10/nat997.cur), auto",
            }}
          >
            {postIsLikedByCurrentUser ? (
              <FullHeartSVG color="#EE4B2B" height="24px" width="24px" />
            ) : (
              <EmptyHeartSVG color="#000" height="24px" width="24px" />
            )}
          </div>
          <span className={styles.preventHighlightSelect}>
            {postLikes.length}
          </span>
        </div>
        <button className={styles.actionButtonPrimary} onClick={handleEditPost}>
          {editMode ? "Save" : "Edit"}
        </button>{" "}
        <button
          className={styles.actionButtonPrimary}
          ref={deletePostBtn}
          onClick={handleDeletePost}
        >
          {clickedOnce ? "Sure? 'Y'" : "Delete"}
        </button>{" "}
      </div>
    </div>
  );
}
