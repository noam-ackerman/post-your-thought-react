import { useState, useEffect, useCallback, type RefObject } from "react";

export function useRenderMorePosts(
  postsWrapperRef: RefObject<HTMLDivElement | null>,
  postsLength: number | undefined
) {
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);

  const renderMorePosts = useCallback(() => {
    const lastChild = postsWrapperRef.current?.lastChild as HTMLElement | null;
    const elementBottom = (lastChild?.offsetTop ?? 0) - 600;
    const lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts((currentNum) => currentNum + 15);
    }
  }, [postsWrapperRef]);

  useEffect(() => {
    if ((postsLength ?? 0) - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [postsLength, numDisplayedPosts, renderMorePosts]);

  return [numDisplayedPosts] as const;
}
