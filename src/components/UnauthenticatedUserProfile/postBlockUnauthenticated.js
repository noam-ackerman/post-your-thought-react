import React, { useState } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../logos";
import styles from "../../style-modules/style.module.css";

export default function PostBlockUnauthenticated(props) {
  let date = new Date(props.post.date);
  let year = date.getFullYear(),
    month = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2),
    hour = ("0" + date.getHours()).slice(-2),
    minutes = ("0" + date.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  const [imageLoaded, setImageLoaded] = useState(false);
  const { likesData, updatePostsLikes } = useUsersCtx();
  const { currentUser } = useAuth();
  const heart = React.useRef();
  let postLikesObj = likesData[props.post.id] ? likesData[props.post.id] : null;
  let postLikes = postLikesObj ? postLikesObj.likes : [];
  let postIsLikedByCurrentUser = postLikes.includes(currentUser.uid);
  const homepageClass = props.homepage ? styles.maxWidth1200 : "";

  function handleLike(postId, likes) {
    if (heart.current.getAttribute("action") === "like") {
      let data = [...likes, currentUser.uid];
      updatePostsLikes(postId, data);
    } else if (heart.current.getAttribute("action") === "unlike") {
      let data = likes.filter((x) => x !== currentUser.uid);
      updatePostsLikes(postId, data);
    }
  }

  return (
    <div className={`${styles.postBlockWrraper} ${homepageClass}`}>
      <div className={styles.postInfoLineWrapper}>
        <Link
          to={`/${props.user.userId}`}
          className={styles.profileImgThumbnailWrapper}
        >
          <img
            className={styles.profileImgThumbnail}
            src={props.user.photoURL}
            alt={props.user.displayName}
            style={{ display: imageLoaded ? "block" : "none" }}
            onLoad={() => setImageLoaded(true)}
          />
        </Link>
        <Link to={`/${props.user.userId}`} className={styles.usernamePost}>
          {props.user.displayName}
        </Link>
        <div className={styles.dateAndTime}>{time}</div>
      </div>

      <div className={styles.postContent}>{props.post.content}</div>
      <div className={styles.likeWrapper}>
        <div
          ref={heart}
          onClick={(e) => handleLike(props.post.id, postLikes)}
          action={postIsLikedByCurrentUser ? "unlike" : "like"}
          style={{ cursor: "pointer" }}
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
  );
}
