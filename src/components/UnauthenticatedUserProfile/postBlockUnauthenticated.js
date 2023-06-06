import React, { useState, useRef } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../logos";
import FormatDate from "../formatDate";
import styles from "../../style-modules/style.module.css";

export default function PostBlockUnauthenticated(props) {
  const user = props.user;
  let time = FormatDate(props.post.date);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { likesData, updatePostsLikes } = useUsersCtx();
  const { currentUser } = useAuth();
  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();
  const [longPost, setLongPost] = useState(false);
  const [showMorePost, setShowMorePost] = useState(false);
  let postLikesObj = likesData[props.post.id] ? likesData[props.post.id] : null;
  let postLikes = postLikesObj ? postLikesObj.likes : [];
  let postIsLikedByCurrentUser = postLikes.includes(currentUser.uid);

  function handleLike(postId, likes) {
    let data;
    if (heart.current.getAttribute("action") === "like") {
      data = [...likes, currentUser.uid];
    } else if (heart.current.getAttribute("action") === "unlike") {
      data = likes.filter((x) => x !== currentUser.uid);
    }
    updatePostsLikes(postId, data).catch(() => alert("Something went wrong!"));
  }

  function ShowMore() {
    setShowMorePost(!showMorePost);
  }

  React.useEffect(() => {
    if (
      postContent?.current.clientHeight >
      postContentWrapper?.current.clientHeight
    ) {
      setLongPost(true);
    } else {
      setLongPost(false);
    }
  }, [props.post.content]);

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
          <div ref={postContent}>{props.post.content}</div>
        </div>
        {longPost && !showMorePost && (
          <div style={{ color: "#7c606b" }}>...</div>
        )}
        {longPost && (
          <div className={styles.showMoreBtn} onClick={ShowMore}>
            {showMorePost ? "Show less" : "Show more"}
          </div>
        )}
      </div>
      <div className={styles.actionWrapper}>
        <div className={styles.likeWrapper}>
          <div
            ref={heart}
            onClick={(e) => handleLike(props.post.id, postLikes)}
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
