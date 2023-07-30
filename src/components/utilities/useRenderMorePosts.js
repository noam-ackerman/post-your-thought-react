import { useState } from "react";

export default function useRenderMorePosts({ ref }) {
  const [numDisplayedPosts, setNumDisplayedPosts] = useState(14);

  const renderMorePosts = () => {
    let elementBottom = ref.current.lastChild.offsetTop - 600;
    let lastPositionY = window.scrollY;
    if (lastPositionY > elementBottom) {
      setNumDisplayedPosts((currentNum) => currentNum + 15);
    }
  };

  return [numDisplayedPosts, renderMorePosts];
}
