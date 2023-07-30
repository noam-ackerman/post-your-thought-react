import { useState, useEffect, useCallback } from "react";

export default function useRenderMorePosts({ ref, postsLength }) {
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);

  const renderMorePosts = useCallback(() => {
    let elementBottom = ref.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts((currentNum) => currentNum + 15);
    }
  }, [ref]);

  useEffect(() => {
    if (postsLength - 1 > numDisplayedPosts) {
      document.addEventListener("scroll", renderMorePosts);
    }
    return () => document.removeEventListener("scroll", renderMorePosts);
  }, [postsLength, numDisplayedPosts, renderMorePosts]);

  return [numDisplayedPosts];
}
