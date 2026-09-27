import { useRef } from "react";
import { PostingForm } from "./PostingForm";
import { PostBlock } from "./PostBlock";
import { useRenderMorePosts } from "@/utilities/customHooks/useRenderMorePosts";
import styles from "@/style-modules/global.module.css";
import postsStyles from "@/style-modules/components/posts.module.css";
import type { PostRecord, UserRecord } from "@/types";

interface PostsSectionProps {
  user: UserRecord;
  isOwner: boolean;
  posts: PostRecord[];
}

export function PostsSection({ user, isOwner, posts }: PostsSectionProps) {
  const postsWrapper = useRef<HTMLDivElement>(null);

  const [numDisplayedPosts] = useRenderMorePosts(postsWrapper, posts?.length);

  return (
    <div ref={postsWrapper} className={postsStyles.postingSectionWrapper}>
      {isOwner && <PostingForm />}
      {posts?.length ? (
        posts.map((post, index) => {
          if (index <= numDisplayedPosts) {
            return (
              <PostBlock
                key={post.postId}
                post={post}
                author={user}
                canEdit={isOwner}
              />
            );
          } else {
            return null;
          }
        })
      ) : (
        <div className={`${styles.SecondaryTitle} ${styles.marginTopBottom3}`}>
          No Posts Yet
        </div>
      )}
    </div>
  );
}
