import React from "react";
import { useUsersCtx } from "../context/usersContext";
import { useAuth } from "../context/AuthContext";
import { Hearts } from "react-loader-spinner";
import PostingForm from "../components/AuthenticatedUserProfile/postingForm";
import PostBlockUnauthenticated from "../components/UnauthenticatedUserProfile/postBlockUnauthenticated";
import PostBlockAuthenticated from "../components/AuthenticatedUserProfile/postBlockAuthenticated";
import styles from "../style-modules/style.module.css";

export default function Homepage() {
  const { currentUser } = useAuth();
  const { usersData, likesData, currentUserData } = useUsersCtx();
  const [usersPostsArray, setUsersPostsArray] = React.useState([]);
  const [numPosts, setNumPosts] = React.useState(14);
  const [disable, setDisable] = React.useState(false);

  const welcome = React.useRef();
  const title = React.useRef();

  React.useEffect(() => {
    if (usersData) {
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
        .sort((a, b) => b.post.date - a.post.date);
      setUsersPostsArray(usersPosts);
    }
  }, [usersData]);

  React.useEffect(() => {
    if (usersData && usersPostsArray) {
      if (numPosts >= usersPostsArray.length - 1) {
        setDisable(true);
      } else {
        setDisable(false);
      }
    }
  }, [numPosts, usersData, usersPostsArray]);

  React.useEffect(() => {
    if (usersData && likesData && currentUserData) {
      Array.from(welcome.current.children).forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = 1;
        }, 220 * (index + 1));
      });
      Array.from(title.current.children).forEach((child, index) => {
        setTimeout(() => {
          child.style.display = "inline-block";
        }, 200 * (index + 8));
      });
    }
  }, [usersData, likesData, currentUserData]);

  return (
    <>
      {usersData && likesData && currentUserData ? (
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
          <div className={`${styles.hpPostsWrapper} ${styles.marginAuto}`}>
            <div ref={title} className={styles.titleHpText}>
              <span>U</span>
              <span>s</span>
              <span>e</span>
              <span>r</span>
              <span>s</span>
              <span>&nbsp; </span>
              <span>T</span>
              <span>h</span>
              <span>o</span>
              <span>u</span>
              <span>g</span>
              <span>h</span>
              <span>t</span>
              <span>s</span>
              <span>&nbsp;</span>
              <span>.</span>
              <span>｡</span>
              <span>ｏ</span>
              <span>♡</span>
              <span>✧</span>
              <span>+</span>
              <span>°</span>
              <span>･</span>
              <span>☆</span>
              <span>✧</span>
              <div className={styles.cursor}></div>
            </div>
            <PostingForm />
            {usersPostsArray.length ? (
              usersPostsArray.map((post, index) => {
                if (index <= numPosts) {
                  if (post.user.userId === currentUser.uid) {
                    return (
                      <PostBlockAuthenticated
                        key={post.post.id}
                        post={post.post}
                      />
                    );
                  } else {
                    return (
                      <PostBlockUnauthenticated
                        key={post.post.id}
                        user={post.user}
                        post={post.post}
                      />
                    );
                  }
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
