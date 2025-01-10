import React, { useState, useRef } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../../utilities/logos";
import { formatDate, handleLike } from "../../utilities/actions";
import useLongPost from "../../utilities/customHooks/useLongPost";
import styles from "../../style-modules/global.module.css";
import postsStyles from "../../style-modules/components/posts.module.css";

export default function PostBlockUnauthenticated({ user, post }) {
  const time = formatDate(post.date);
  const { updatePost, currentUserData } = useUsersCtx();
  const [imageLoaded, setImageLoaded] = useState(false);

  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();

  const editMode = false;
  const [longPost, showMorePost, , handleShowMore] = useLongPost(
    editMode,
    post.content,
    postContent,
    postContentWrapper
  );

  const postLikes = post.likes ? post.likes : [];
  const postIsLikedByCurrentUser = postLikes.includes(currentUserData.userId);

  return (
    <div className={postsStyles.postBlockWrraper}>
      <div className={postsStyles.postInfoLineWrapper}>
        <div className={postsStyles.userInfo}>
          <Link
            to={`/${user.userId}`}
            className={styles.profileImgThumbnailWrapper}
          >
            <img
              className={styles.profileImgThumbnail}
              src={user.photoURL}
              alt={user.displayName}
              style={{ display: imageLoaded ? "block" : "none" }}
              onLoad={() => setImageLoaded(true)}
            />
          </Link>
          <Link to={`/${user.userId}`} className={postsStyles.usernamePost}>
            {user.displayName}
          </Link>
        </div>
        <div className={postsStyles.dateAndTime}>{time}</div>
      </div>

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
      </div>
    </div>
  );
}
