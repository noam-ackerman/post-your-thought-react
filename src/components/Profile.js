import React, { useState } from "react";
import Navbar from "./navbar";
import ProfileBlock from "./ProfileBlock";
import styles from "../style-modules/style.module.css";
import PostingForm from "./postingForm";
import PostBlock from "./postBlock";
// import Footer from "./footer";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { currentUser } = useAuth();
  const [userPosts, setUserPosts] = useState([]);

  function addingPostFromForm(newPostData) {
    setUserPosts([newPostData, ...userPosts]);
  }

  function deletePost(post) {
    let newPostsArray = userPosts.filter((x) => x.id !== post.id);
    setUserPosts(newPostsArray);
  }

  function editPost(post, newContent) {
    let newPostsArray = userPosts.map((x) => {
      if (x.id === post.id) {
        return { ...x, content: newContent };
      } else {
        return x;
      }
    });
    setUserPosts(newPostsArray);
  }

  return (
    <>
      <Navbar />
      <div className={styles.profileContainerContent}>
        <ProfileBlock />
        <div className={styles.postingSectionWrapper}>
          <PostingForm addingPostFromForm={addingPostFromForm} />
          {userPosts.length === 0 && (
            <div class={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}>
              No Posts Yet
            </div>
          )}
          {userPosts?.map((post) => {
            return (
              <PostBlock
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
      {/* <Footer /> */}
    </>
  );
}
