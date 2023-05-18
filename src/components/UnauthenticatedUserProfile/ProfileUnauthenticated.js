import React from "react";
import styles from "../../style-modules/style.module.css";
import ProfileBlockUnauthenticated from "./ProfileBlockUnauthenticated";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";

export default function ProfileAuthenticated(props) {
  const user = props.user;
  const [numPosts, setNumPosts] = React.useState(14);
  const [disable, setDisable] = React.useState(false);

  console.log(user.posts);

  React.useEffect(() => {
    if (user.posts) {
      if (numPosts >= user.posts.length - 1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [numPosts, user]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockUnauthenticated user={user} />
      <div className={styles.postingSectionWrapper}>
        {!user.posts && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {user.posts?.map((post, index) => {
          if (index <= numPosts) {
            return (
              <PostBlockUnauthenticated key={post.id} user={user} post={post} />
            );
          } else {
            return null;
          }
        })}
        {!disable && user.posts && (
          <button
            className={styles.actionButtonPrimary}
            onClick={() => setNumPosts(numPosts + 15)}
          >
            Load More Posts
          </button>
        )}
      </div>
    </div>
  );
}
