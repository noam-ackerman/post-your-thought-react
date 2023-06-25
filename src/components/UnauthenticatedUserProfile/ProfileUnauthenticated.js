import React from "react";
import styles from "../../style-modules/style.module.css";
import ProfileBlockUnauthenticated from "./ProfileBlockUnauthenticated";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";

export default function ProfileUnauthenticated(props) {
  const user = props.user;
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
    if (user.posts && user.posts.length - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [user.posts, numDisplayedPosts, renderMorePosts]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockUnauthenticated user={user} />
      <div ref={postsWrapper} className={styles.postingSectionWrapper}>
        {!user.posts && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {user.posts?.map((post, index) => {
          if (index <= numDisplayedPosts) {
            return (
              <PostBlockUnauthenticated key={post.id} user={user} post={post} />
            );
          } else {
            return null;
          }
        })}
      </div>
    </div>
  );
}
