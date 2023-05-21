import React from "react";
import Navbar from "../components/navbar";
import { useUsersCtx } from "../context/usersContext";
import { Hearts } from "react-loader-spinner";
import PostBlockUnauthenticated from "../components/UnauthenticatedUserProfile/postBlockUnauthenticated";
import styles from "../style-modules/style.module.css";

export default function Homepage() {
  const { usersData, fetchingUsers, likesData, fetchingLikes } = useUsersCtx();
  const [usersPostsArray, setUsersPostsArray] = React.useState([]);
  const [numPosts, setNumPosts] = React.useState(14);
  const [disable, setDisable] = React.useState(false);

  const welcome = React.useRef();

  React.useEffect(() => {
    fetchingUsers();
    fetchingLikes();
  }, [fetchingUsers, fetchingLikes]);

  React.useEffect(() => {
    if (usersData && likesData) {
      const usersPosts = Object.values(usersData)
        .flatMap((user) =>
          user.posts?.map((post) => {
            return {
              post: { ...post },
              user: {
                displayName: user.displayName,
                photoURL: user.photoURL,
                userId: user.userId,
              },
            };
          })
        )
        .filter((n) => n)
        .sort((a, b) => b.date - a.date);
      setUsersPostsArray(usersPosts);

      Array.from(welcome.current.children).forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = 1;
        }, 220 * (index + 1));
      });
    }
  }, [usersData, likesData]);

  React.useEffect(() => {
    if (usersData && usersPostsArray) {
      if (numPosts >= usersPostsArray.length - 1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [numPosts, usersData, usersPostsArray]);

  return (
    <>
      <Navbar />
      {usersData && likesData ? (
        <>
          <div className={styles.heroBanner}>
            <div ref={welcome} className={styles.welcomeText}>
              <span style={{ color: "#eed5c2" }}>W</span>
              <span style={{ color: "#ccbfff" }}>E</span>
              <span style={{ color: "#c1f7dc" }}>L</span>
              <span style={{ color: "rgb(187, 233, 255, 0.8)" }}>C</span>
              <span style={{ color: "#FFA9D4" }}>O</span>
              <span style={{ color: "#eed5c2" }}>M</span>
              <span style={{ color: "#ccbfff" }}>E</span>
            </div>
          </div>
          <div className={styles.hpPostsWrapper}>
            {usersPostsArray.length ? (
              usersPostsArray.map((post, index) => {
                if (index <= numPosts) {
                  return (
                    <PostBlockUnauthenticated
                      key={post.post.id}
                      user={post.user}
                      post={post.post}
                      homepage={true}
                    />
                  );
                } else {
                  return null;
                }
              })
            ) : (
              <div
                className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}
              >
                No Posts Yet
              </div>
            )}
            {!disable && (
              <button
                className={styles.actionButtonPrimary}
                onClick={() => setNumPosts(numPosts + 15)}
              >
                Load More Posts
              </button>
            )}
          </div>
        </>
      ) : (
        <Hearts
          height="200"
          width="200"
          color="#B5A1FF"
          ariaLabel="hearts-loading"
          wrapperStyle={{}}
          wrapperClass={styles.heartsPageLoader}
          visible={true}
        />
      )}
    </>
  );
}
