import React, { useRef, useState } from "react";
import { useUsersCtx } from "../../context/usersContext";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { EmptyHeartSVG, FullHeartSVG } from "../logos";
import FormatDate from "../formatDate";
import styles from "../../style-modules/style.module.css";

export default function PostBlockAuthenticated(props) {
  const textAreaEdit = useRef();
  const [editMode, setEditMode] = useState(false);
  let time = FormatDate(props.post.date);
  const [imageLoaded, setImageLoaded] = useState(false);
  const {
    likesData,
    updatePostsLikes,
    removePostsLikes,
    currentUserData,
    updateUserDatabase,
  } = useUsersCtx();
  const { currentUser } = useAuth();
  const heart = useRef();
  const postContentWrapper = useRef();
  const postContent = useRef();
  const [longPost, setLongPost] = useState(false);
  const [showMorePost, setShowMorePost] = useState(false);

  let postLikesObj = likesData[props.post.id] ? likesData[props.post.id] : null;
  let postLikes = postLikesObj ? postLikesObj.likes : [];
  let postIsLikedByCurrentUser = postLikes.includes(currentUser.uid);

  async function handleLike(postId, likes) {
    try {
      if (heart.current.getAttribute("action") === "like") {
        let data = [...likes, currentUser.uid];
        await updatePostsLikes(postId, data);
      } else if (heart.current.getAttribute("action") === "unlike") {
        let data = likes.filter((x) => x !== currentUser.uid);
        await updatePostsLikes(postId, data);
      }
    } catch {
      alert("Something went wrong!");
    }
  }

  async function handleDeletePost(postId) {
    try {
      let newPostsArray = currentUserData.posts?.filter((x) => x.id !== postId);
      await updateUserDatabase({ posts: newPostsArray });
      await removePostsLikes(postId);
    } catch {
      alert("Something went wrong!");
    }
  }

  async function editPost(post, newContent) {
    try {
      let newPostsArray = currentUserData.posts?.map((x) => {
        if (x.id === post.id) {
          return { ...x, content: newContent };
        } else {
          return x;
        }
      });
      await updateUserDatabase({ posts: newPostsArray });
    } catch {
      alert("Something went wrong!");
    }
  }

  function handleEditPost() {
    if (!editMode) {
      setEditMode(true);
      if (showMorePost) {
        setShowMorePost(false);
      }
    }
    if (editMode) {
      let newContent = textAreaEdit.current.value;
      if (textAreaEdit.current.value.trim() === "") {
        return;
      } else {
        setEditMode(false);
        editPost(props.post, newContent);
      }
    }
  }

  function ShowMore() {
    setShowMorePost(!showMorePost);
  }

  React.useEffect(() => {
    if (!editMode) {
      if (
        postContent?.current.clientHeight >
        postContentWrapper?.current.clientHeight
      ) {
        setLongPost(true);
      } else {
        setLongPost(false);
      }
    }
  }, [editMode, props.post.content]);

  return (
    <div className={styles.postBlockWrraper}>
      <div className={styles.postInfoLineWrapper}>
        <div className={styles.userInfo}>
          <Link
            to={`/${currentUser.uid}`}
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
          <Link to={`/${currentUser.uid}`} className={styles.usernamePost}>
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
          defaultValue={props.post.content}
        />
      ) : (
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
      )}
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
        <button className={styles.actionButtonPrimary} onClick={handleEditPost}>
          {editMode ? "Save" : "Edit"}
        </button>{" "}
        <button
          className={styles.actionButtonPrimary}
          onClick={(e) => handleDeletePost(props.post.id)}
        >
          Delete
        </button>{" "}
      </div>
    </div>
  );
}
