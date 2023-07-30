import React, { useState, useRef } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../utilities/logos";
import { formatDate } from "../utilities/actions";
import styles from "../../style-modules/style.module.css";

export default function PostBlockUnauthenticated(props) {
  const user = props.user;
  const post = props.post;
  const time = formatDate(post.date);
  const { updatePost, currentUserData } = useUsersCtx();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [longPost, setLongPost] = useState(false);
  const [showMorePost, setShowMorePost] = useState(false);

  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();

  const postLikes = post.likes ? post.likes : [];
  const postIsLikedByCurrentUser = postLikes.includes(currentUserData.userId);

  function handleLike() {
    let data;
    if (heart.current.getAttribute("action") === "like") {
      data = [...postLikes, currentUserData.userId];
    } else if (heart.current.getAttribute("action") === "unlike") {
      data = postLikes.filter((x) => x !== currentUserData.userId);
    }
    updatePost(post.postId, { likes: data }).catch(() =>
      alert("Something went wrong!")
    );
  }

  function showMore() {
    setShowMorePost(!showMorePost);
  }

  React.useEffect(() => {
    postContent?.current.clientHeight > postContentWrapper?.current.clientHeight
      ? setLongPost(true)
      : setLongPost(false);
  }, [post.content]);

  return (
    <div className={styles.postBlockWrraper}>
      <div className={styles.postInfoLineWrapper}>
        <div className={styles.userInfo}>
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
          <Link to={`/${user.userId}`} className={styles.usernamePost}>
            {user.displayName}
          </Link>
        </div>
        <div className={styles.dateAndTime}>{time}</div>
      </div>

      <div className={styles.postWrapper}>
        <div
          ref={postContentWrapper}
          className={styles.postContent}
          style={{ maxHeight: longPost && showMorePost && "max-content" }}
        >
          <div ref={postContent}>{post.content}</div>
        </div>
        {longPost && !showMorePost && (
          <div style={{ color: "#7c606b" }}>...</div>
        )}
        {longPost && (
          <div className={styles.showMoreBtn} onClick={showMore}>
            {showMorePost ? "Show less" : "Show more"}
          </div>
        )}
      </div>
      <div className={styles.actionWrapper}>
        <div className={styles.likeWrapper}>
          <div
            ref={heart}
            onClick={handleLike}
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
          <span>{postLikes.length}</span>
        </div>
      </div>
    </div>
  );
}
