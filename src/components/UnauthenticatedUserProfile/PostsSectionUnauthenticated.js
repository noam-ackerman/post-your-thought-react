import React from "react";
import { useUsersCtx } from "../../context/usersContext";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";
import useRenderMorePosts from "../utilities/useRenderMorePosts";
import styles from "../../style-modules/style.module.css";

export default function PostsSectionUnauthenticated(props) {
  const user = props.user;
  const { postsData } = useUsersCtx();
  const [userPosts, setUserPosts] = React.useState(null);
  const postsWrapper = React.useRef();
  const [numDisplayedPosts] = useRenderMorePosts({
    ref: postsWrapper,
    postsLength: userPosts?.length,
  });

  React.useLayoutEffect(() => {
    const filteredPosts = postsData.filter(
      (post) => post.userId === user.userId
    );
    filteredPosts.length ? setUserPosts(filteredPosts) : setUserPosts([]);
  }, [postsData, user]);

  return (
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
        <div className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}>
          No Posts Yet
        </div>
      )}
    </div>
  );
}
