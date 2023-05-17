import React from "react";
import styles from "../../style-modules/style.module.css";
import ProfileBlockUnauthenticated from "./ProfileBlockUnauthenticated";
import PostBlockUnauthenticated from "./postBlockUnauthenticated";

export default function ProfileAuthenticated(props) {
  const user = props.user;

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockUnauthenticated user={user} />
      <div className={styles.postingSectionWrapper}>
        {user.posts?.length === 0 && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {user.posts?.map((post) => {
          return (
            <PostBlockUnauthenticated key={post.id} user={user} post={post} />
          );
        })}
      </div>
    </div>
  );
}
