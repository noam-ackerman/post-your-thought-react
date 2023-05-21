import React from "react";
import ProfileBlockAuthenticated from "./ProfileBlockAuthenticated";
import styles from "../../style-modules/style.module.css";
import PostingForm from "./postingForm";
import PostBlockAuthenticated from "./postBlockAuthenticated";
import { Hearts } from "react-loader-spinner";
import { useAuth } from "../../context/AuthContext";
import { useUsersCtx } from "../../context/usersContext";

export default function ProfileAuthenticated() {
  const { currentUser } = useAuth();
  const { currentUserPosts, setCurrentUserPosts, updateUserDatabase } =
    useUsersCtx();
  const [numPosts, setNumPosts] = React.useState(14);
  const [disable, setDisable] = React.useState(false);

  React.useEffect(() => {
    if (currentUserPosts) {
      if (numPosts >= currentUserPosts.length - 1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [numPosts, currentUserPosts]);

  async function addingPostFromForm(newPostData) {
    try {
      await updateUserDatabase({ posts: [newPostData, ...currentUserPosts] });
      setCurrentUserPosts([newPostData, ...currentUserPosts]);
    } catch {
      alert("Something went wrong!");
    }
  }

  async function deletePost(post) {
    try {
      let newPostsArray = currentUserPosts.filter((x) => x.id !== post.id);
      await updateUserDatabase({ posts: newPostsArray });
      setCurrentUserPosts(newPostsArray);
    } catch {
      alert("Something went wrong!");
    }
  }

  async function editPost(post, newContent) {
    try {
      let newPostsArray = currentUserPosts.map((x) => {
        if (x.id === post.id) {
          return { ...x, content: newContent };
        } else {
          return x;
        }
      });
      await updateUserDatabase({ posts: newPostsArray });
      setCurrentUserPosts(newPostsArray);
    } catch {
      alert("Something went wrong!");
    }
  }

  function handleLikes() {}

  if (currentUserPosts) {
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
          {currentUserPosts.map((post, index) => {
            if (index <= numPosts) {
              return (
                <PostBlockAuthenticated
                  key={post.id}
                  user={currentUser}
                  post={post}
                  deletePost={deletePost}
                  editPost={editPost}
                  handleLikes={handleLikes}
                />
              );
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
  } else {
    return (
      <Hearts
        height="200"
        width="200"
        color="#B5A1FF"
        ariaLabel="hearts-loading"
        wrapperStyle={{}}
        wrapperClass={styles.heartsPageLoader}
        visible={true}
      />
    );
  }
}
