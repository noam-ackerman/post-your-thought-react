import React from "react";
import ProfileBlockAuthenticated from "./ProfileBlockAuthenticated";
import PostingForm from "../postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import { useUsersCtx } from "../../context/usersContext";
import styles from "../../style-modules/style.module.css";

export default function ProfileAuthenticated() {
  const { currentUserData, postsData } = useUsersCtx();
  const [numDisplayedPosts, setNumDisplayedPosts] = React.useState(14);
  const [currentUserPosts, setCurrentUserPosts] = React.useState(null);
  const postsWrapper = React.useRef();

  React.useLayoutEffect(() => {
    const filteredPosts = postsData.filter(
      (post) => post.userId === currentUserData.userId
    );
    filteredPosts.length
      ? setCurrentUserPosts(filteredPosts)
      : setCurrentUserPosts([]);
  }, [postsData, currentUserData]);

  const renderMorePosts = React.useCallback(() => {
    let elementBottom = postsWrapper.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts(numDisplayedPosts + 15);
    }
  }, [numDisplayedPosts]);

  React.useEffect(() => {
    if (currentUserPosts && currentUserPosts.length - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [currentUserPosts, numDisplayedPosts, renderMorePosts]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockAuthenticated />
      <div ref={postsWrapper} className={styles.postingSectionWrapper}>
        <PostingForm />
        {currentUserPosts?.length ? (
          currentUserPosts.map((post, index) => {
            if (index <= numDisplayedPosts) {
              return <PostBlockAuthenticated key={post.postId} post={post} />;
            } else {
              return null;
            }
          })
        ) : (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
      </div>
    </div>
  );
}
