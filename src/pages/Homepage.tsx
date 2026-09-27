import { useRef, useEffect } from "react";
import { useUsersCtx } from "@/context/UsersContext";
import { useAuth } from "@/context/AuthContext";
import { HeartsPageLoader } from "@/components/atoms";
import { PostingForm } from "@/components/posts/PostingForm";
import { PostBlock } from "@/components/posts/PostBlock";
import { useRenderMorePosts } from "@/utilities/customHooks/useRenderMorePosts";
import styles from "@/style-modules/global.module.css";
import homepageStyles from "@/style-modules/pages/homepage.module.css";

export function Homepage() {
  const { currentUser } = useAuth();
  const { usersData, postsData, currentUserData } = useUsersCtx();
  const welcome = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const feedsWrapper = useRef<HTMLDivElement>(null);
  const [numDisplayedPosts, sentinelRef] = useRenderMorePosts(postsData?.length);

  const dataLoaded =
    usersData !== undefined &&
    postsData !== undefined &&
    currentUserData !== undefined;

  useEffect(() => {
    if (dataLoaded) {
      Array.from(welcome.current!.children).forEach((child, index) => {
        setTimeout(() => {
          (child as HTMLElement).style.opacity = "1";
        }, 220 * (index + 1));
      });
      Array.from(title.current!.children).forEach((child, index) => {
        setTimeout(() => {
          (child as HTMLElement).style.display = "inline-block";
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
            {postsData!.length ? (
              postsData!.map((post, index) => {
                if (index <= numDisplayedPosts) {
                  const isOwnPost = post.userId === currentUser!.uid;
                  const author = isOwnPost
                    ? currentUserData
                    : usersData![post.userId];
                  return (
                    <PostBlock
                      key={post.postId}
                      post={post}
                      author={author}
                      canEdit={isOwnPost}
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
            <div ref={sentinelRef} />
          </div>
        </>
      ) : (
        <HeartsPageLoader />
      )}
    </>
  );
}
