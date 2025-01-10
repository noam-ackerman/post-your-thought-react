import React from "react";
import { useUsersCtx } from "../../context/usersContext";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";
import useRenderMorePosts from "../../utilities/customHooks/useRenderMorePosts";
import styles from "../../style-modules/style.module.css";
import postsStyles from "../../style-modules/components/posts.module.css";

export default function PostsSectionUnauthenticated({ user }) {
  const { postsData } = useUsersCtx();
  const postsWrapper = React.useRef();

  const userPosts = React.useMemo(
    () => postsData.filter((post) => post.userId === user.userId),
    [postsData, user.userId]
  );

  const [numDisplayedPosts] = useRenderMorePosts(
    postsWrapper,
    userPosts?.length
  );

  return (
    <div ref={postsWrapper} className={postsStyles.postingSectionWrapper}>
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
        <div className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}>
          No Posts Yet
        </div>
      )}
    </div>
  );
}
