import React, { useCallback, useState } from "react";
import { useUsersCtx } from "../context/usersContext";
import { useAuth } from "../context/AuthContext";
import { Hearts } from "react-loader-spinner";
import PostingForm from "../components/postingForm";
import PostBlockUnauthenticated from "../components/UnauthenticatedUserProfile/postBlockUnauthenticated";
import PostBlockAuthenticated from "../components/AuthenticatedUserProfile/postBlockAuthenticated";
import ScrollToTop from "../components/resources/scrollToTop";
import styles from "../style-modules/style.module.css";

export default function Homepage() {
  const { currentUser } = useAuth();
  const { usersData, postsData, currentUserData } = useUsersCtx();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);

  const welcome = React.useRef();
  const title = React.useRef();
  const postsWrapper = React.useRef();

  React.useLayoutEffect(() => {
    if (!dataLoaded && usersData && postsData && currentUserData) {
      setDataLoaded(true);
    }
  }, [dataLoaded, usersData, postsData, currentUserData]);

  React.useEffect(() => {
    if (dataLoaded) {
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
  }, [dataLoaded]);

  const renderMorePosts = useCallback(() => {
    let elementBottom = postsWrapper.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts(numDisplayedPosts + 15);
    }
  }, [numDisplayedPosts]);

  React.useEffect(() => {
    if (dataLoaded && postsData.length - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [dataLoaded, numDisplayedPosts, postsData, renderMorePosts]);

  return (
    <>
      {dataLoaded ? (
        <>
          <ScrollToTop posts={postsData} />
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
          <div
            ref={postsWrapper}
            className={`${styles.hpPostsWrapper} ${styles.marginAuto}`}
          >
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
            {postsData.length ? (
              postsData.map((post, index) => {
                if (index <= numDisplayedPosts) {
                  if (post.userId === currentUser.uid) {
                    return (
                      <PostBlockAuthenticated key={post.postId} post={post} />
                    );
                  } else {
                    let user = usersData[post.userId];
                    return (
                      <PostBlockUnauthenticated
                        key={post.postId}
                        user={user}
                        post={post}
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
