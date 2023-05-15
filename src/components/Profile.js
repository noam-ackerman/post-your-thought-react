import React, { useState, useRef } from "react";
import Navbar from "./navbar";
import ProfileBlock from "./ProfileBlock";
import styles from "../style-modules/style.module.css";
import PostingForm from "./postingForm";
import PostBlock from "./postBlock";
// import Footer from "./footer";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, onValue } from "firebase/database";

export default function Profile() {
  const { currentUser, updateUserDatabase } = useAuth();
  const [userPosts, setUserPosts] = useState();
  const database = getDatabase();

  const didMount = useRef(false);

  // const Ref = ref(database, "users");
  // onValue(Ref, (snapshot) => {
  //   const data = snapshot.val();
  //   if (data) {
  //     console.log("users", data);
  //   }
  // });

  React.useEffect(() => {
    if (didMount.current) {
      updateUserDatabase({ posts: [...userPosts] });
    }
  }, [userPosts, currentUser, database, updateUserDatabase]);

  React.useEffect(() => {
    const postsRef = ref(database, "users/" + currentUser.uid + "/posts");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserPosts(data);
        didMount.current = true;
      } else {
        setUserPosts([]);
        didMount.current = true;
      }
    });
  }, [currentUser.uid, database]);

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
          {userPosts?.length === 0 && (
            <div
              className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
            >
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
