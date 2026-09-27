import { useState, useEffect, useRef } from "react";

export function useRenderMorePosts(postsLength: number | undefined) {
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasMore = (postsLength ?? 0) - 1 > numDisplayedPosts;
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setNumDisplayedPosts((currentNum) => currentNum + 15);
        }
      },
      { rootMargin: "600px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [postsLength, numDisplayedPosts]);

  return [numDisplayedPosts, sentinelRef] as const;
}
