import React from "react";
import { useUsersCtx } from "../context/usersContext";
import { useAuth } from "../context/AuthContext";
import { HeartsPageLoader } from "../utilities/spinners";
import PostingForm from "../components/postingForm";
import PostBlockUnauthenticated from "../components/UnauthenticatedUserProfile/postBlockUnauthenticated";
import PostBlockAuthenticated from "../components/AuthenticatedUserProfile/postBlockAuthenticated";
import useRenderMorePosts from "../utilities/customHooks/useRenderMorePosts";
import styles from "../style-modules/global.module.css";
import homepageStyles from "../style-modules/pages/homepage.module.css";

export default function Homepage() {
  const { currentUser } = useAuth();
  const { usersData, postsData, currentUserData } = useUsersCtx();
  const welcome = React.useRef();
  const title = React.useRef();
  const feedsWrapper = React.useRef();
  const [numDisplayedPosts] = useRenderMorePosts(
    feedsWrapper,
    postsData?.length
  );

  const dataLoaded =
    usersData !== undefined &&
    postsData !== undefined &&
    currentUserData !== undefined;

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

  return (
    <>
      {dataLoaded ? (
        <>
          <div className={homepageStyles.heroBanner}>
            <div ref={welcome} className={homepageStyles.heroBannerText}>
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
            ref={feedsWrapper}
            className={`${homepageStyles.feedsWrapper} ${styles.marginAuto}`}
          >
            <div ref={title} className={homepageStyles.title}>
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
              <div className={homepageStyles.cursor}></div>
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
        <HeartsPageLoader />
      )}
    </>
  );
}
