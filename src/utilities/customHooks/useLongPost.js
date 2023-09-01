import React, { useState } from "react";

export default function useLongPost(
  editMode,
  postContent,
  postContentRef,
  postContentWrapperRef
) {
  const [longPost, setLongPost] = useState();
  const [showMorePost, setShowMorePost] = useState(false);

  function handleShowMore() {
    setShowMorePost(!showMorePost);
  }

  React.useEffect(() => {
    if (!editMode) {
      postContentRef.current?.clientHeight >
      postContentWrapperRef.current?.clientHeight
        ? setLongPost(true)
        : setLongPost(false);
    }
  }, [editMode, postContent, postContentRef, postContentWrapperRef]);

  return [longPost, showMorePost, setShowMorePost, handleShowMore];
}
