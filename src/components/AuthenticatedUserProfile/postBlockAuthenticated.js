import React, { useRef, useState } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../../utilities/icons";
import { formatDate, handleLike } from "../../utilities/actions";
import useLongPost from "../../utilities/customHooks/useLongPost";
import useToggleBtnClick from "../../utilities/customHooks/useToggleButtonClick";
import styles from "../../style-modules/global.module.css";
import postsStyles from "../../style-modules/components/posts.module.css";

export default function PostBlockAuthenticated({ post }) {
  const time = formatDate(post.date);
  const { updatePost, removePost, currentUserData } = useUsersCtx();
  const [editMode, setEditMode] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();
  const deletePostBtn = useRef();
  const textAreaEdit = useRef();

  const [btnClickedOnce, setBtnClickedOnce] = useToggleBtnClick(
    deletePostBtn?.current
  );
  const [longPost, showMorePost, setShowMorePost, handleShowMore] = useLongPost(
    editMode,
    post.content,
    postContent,
    postContentWrapper
  );

  const postLikes = post.likes ? post.likes : [];
  const postIsLikedByCurrentUser = postLikes.includes(currentUserData.userId);

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
      let newContent = textAreaEdit.current.value;
      if (textAreaEdit.current.value.trim() === "") return;
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
            className={postsStyles.usernamePost}
          >
            {currentUserData?.displayName}
          </Link>
        </div>
        <div className={postsStyles.dateAndTime}>{time}</div>
      </div>
      {editMode ? (
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
            style={{ maxHeight: longPost && showMorePost && "max-content" }}
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
          {btnClickedOnce ? "Sure? 'Y'" : "Delete"}
        </button>{" "}
      </div>
    </div>
  );
}
