import React from "react";
import ProfileBlockAuthenticated from "./ProfileBlockAuthenticated";
import styles from "../../style-modules/style.module.css";
import PostingForm from "./postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import { useAuth } from "../../context/AuthContext";
import { useUsersCtx } from "../../context/usersContext";

export default function ProfileAuthenticated() {
  const { currentUser } = useAuth();
  const { currentUserPosts, setCurrentUserPosts, updateUserDatabase } =
    useUsersCtx();

  function addingPostFromForm(newPostData) {
    setCurrentUserPosts([newPostData, ...currentUserPosts]);
    updateUserDatabase({ posts: [newPostData, ...currentUserPosts] });
  }

  function deletePost(post) {
    let newPostsArray = currentUserPosts.filter((x) => x.id !== post.id);
    setCurrentUserPosts(newPostsArray);
    updateUserDatabase({ posts: newPostsArray });
  }

  function editPost(post, newContent) {
    let newPostsArray = currentUserPosts.map((x) => {
      if (x.id === post.id) {
        return { ...x, content: newContent };
      } else {
        return x;
      }
    });
    setCurrentUserPosts(newPostsArray);
    updateUserDatabase({ posts: newPostsArray });
  }

  return (
    <div className={styles.profileContainerContent}>
      <ProfileBlockAuthenticated />
      <div className={styles.postingSectionWrapper}>
        <PostingForm addingPostFromForm={addingPostFromForm} />
        {currentUserPosts?.length === 0 && (
          <div
            className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
          >
            No Posts Yet
          </div>
        )}
        {currentUserPosts?.map((post) => {
          return (
            <PostBlockAuthenticated
              key={post.id}
              user={currentUser}
              post={post}
              deletePost={deletePost}
              editPost={editPost}
            />
          );
        })}
      </div>
    </div>
  );
}
