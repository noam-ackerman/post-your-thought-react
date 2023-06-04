import React from "react";
import ProfileBlockAuthenticated from "./ProfileBlockAuthenticated";
import styles from "../../style-modules/style.module.css";
import PostingForm from "./postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import { useUsersCtx } from "../../context/usersContext";

export default function ProfileAuthenticated() {
  const { currentUserData } = useUsersCtx();
  const [numPosts, setNumPosts] = React.useState(14);
  const [disable, setDisable] = React.useState(false);

  React.useEffect(() => {
    if (currentUserData.posts) {
      if (numPosts >= currentUserData.posts.length - 1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    } else {
      setDisable(true);
    }
  }, [numPosts, currentUserData]);

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockAuthenticated />
      <div className={styles.postingSectionWrapper}>
        <PostingForm />
        {!currentUserData.posts && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {currentUserData.posts?.map((post, index) => {
          if (index <= numPosts) {
            return <PostBlockAuthenticated key={post.id} post={post} />;
          } else {
            return null;
          }
        })}
        {!disable && (
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
