import React from "react";
import { useUsersCtx } from "../../context/usersContext";
import PostingForm from "../postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import useRenderMorePosts from "../utilities/useRenderMorePosts";
import styles from "../../style-modules/style.module.css";

export default function PostsSectionAuthenticated() {
  const { currentUserData, postsData } = useUsersCtx();
  const [currentUserPosts, setCurrentUserPosts] = React.useState(null);
  const postsWrapper = React.useRef();
  const [numDisplayedPosts] = useRenderMorePosts({
    ref: postsWrapper,
    postsLength: currentUserPosts?.length,
  });

  React.useLayoutEffect(() => {
    const filteredPosts = postsData.filter(
      (post) => post.userId === currentUserData.userId
    );
    filteredPosts.length
      ? setCurrentUserPosts(filteredPosts)
      : setCurrentUserPosts([]);
  }, [postsData, currentUserData.userId]);

  return (
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
        <div className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}>
          No Posts Yet
        </div>
      )}
    </div>
  );
}
