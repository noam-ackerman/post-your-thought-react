import React from "react";
import { useUsersCtx } from "../../context/usersContext";
import ProfileBlockUnauthenticated from "./ProfileBlockUnauthenticated";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";
import styles from "../../style-modules/style.module.css";

export default function ProfileUnauthenticated(props) {
  const user = props.user;
  const { postsData } = useUsersCtx();
  const [numDisplayedPosts, setNumDisplayedPosts] = React.useState(14);
  const [userPosts, setUserPosts] = React.useState(null);
  const postsWrapper = React.useRef();

  React.useLayoutEffect(() => {
    const filteredPosts = postsData.filter(
      (post) => post.userId === user.userId
    );
    filteredPosts.length ? setUserPosts(filteredPosts) : setUserPosts([]);
  }, [postsData, user]);

  const renderMorePosts = React.useCallback(() => {
    let elementBottom = postsWrapper.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts(numDisplayedPosts + 15);
    }
  }, [numDisplayedPosts]);

  React.useEffect(() => {
    if (userPosts && userPosts.length - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [userPosts, numDisplayedPosts, renderMorePosts]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockUnauthenticated user={user} />
      <div ref={postsWrapper} className={styles.postingSectionWrapper}>
        {userPosts?.length ? (
          userPosts.map((post, index) => {
            if (index <= numDisplayedPosts) {
              return (
                <PostBlockUnauthenticated
                  key={post.postId}
                  user={user}
                  post={post}
                />
              );
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
