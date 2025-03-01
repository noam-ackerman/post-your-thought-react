import React from "react";
import { useUsersCtx } from "../../context/usersContext";
import PostingForm from "../postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import useRenderMorePosts from "../../utilities/customHooks/useRenderMorePosts";
import styles from "../../style-modules/global.module.css";
import postsStyles from "../../style-modules/components/posts.module.css";

export default function PostsSectionAuthenticated() {
  const { currentUserData, postsData } = useUsersCtx();
  const postsWrapper = React.useRef();

  const currentUserPosts = React.useMemo(
    () => postsData.filter((post) => post.userId === currentUserData.userId),
    [postsData, currentUserData.userId]
  );

  const [numDisplayedPosts] = useRenderMorePosts(
    postsWrapper,
    currentUserPosts?.length
  );

  return (
    <div ref={postsWrapper} className={postsStyles.postingSectionWrapper}>
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
