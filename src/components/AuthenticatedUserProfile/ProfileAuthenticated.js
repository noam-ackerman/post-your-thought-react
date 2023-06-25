import React from "react";
import ProfileBlockAuthenticated from "./ProfileBlockAuthenticated";
import styles from "../../style-modules/style.module.css";
import PostingForm from "../postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import { useUsersCtx } from "../../context/usersContext";

export default function ProfileAuthenticated() {
  const { currentUserData } = useUsersCtx();
  const [numDisplayedPosts, setNumDisplayedPosts] = React.useState(14);
  const postsWrapper = React.useRef();

  const renderMorePosts = React.useCallback(() => {
    let elementBottom = postsWrapper.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts(numDisplayedPosts + 15);
    }
  }, [numDisplayedPosts]);

  React.useEffect(() => {
    if (
      currentUserData &&
      currentUserData.posts.length - 1 > numDisplayedPosts
    ) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [currentUserData, numDisplayedPosts, renderMorePosts]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockAuthenticated />
      <div ref={postsWrapper} className={styles.postingSectionWrapper}>
        <PostingForm />
        {!currentUserData.posts && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {currentUserData.posts?.map((post, index) => {
          if (index <= numDisplayedPosts) {
            return <PostBlockAuthenticated key={post.id} post={post} />;
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
