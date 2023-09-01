import { useState, useEffect, useCallback } from "react";

export default function useRenderMorePosts(postsWrapperRef, postsLength) {
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);

  const renderMorePosts = useCallback(() => {
    let elementBottom = postsWrapperRef.current?.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts((currentNum) => currentNum + 15);
    }
  }, [postsWrapperRef]);

  useEffect(() => {
    if (postsLength - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [postsLength, numDisplayedPosts, renderMorePosts]);

  return [numDisplayedPosts];
}
