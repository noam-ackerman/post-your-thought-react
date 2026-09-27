import { useEffect, useState, type RefObject } from "react";

export function useLongPost(
  editMode: boolean,
  postContent: string,
  postContentRef: RefObject<HTMLDivElement | null>,
  postContentWrapperRef: RefObject<HTMLDivElement | null>
) {
  const [longPost, setLongPost] = useState<boolean | undefined>();
  const [showMorePost, setShowMorePost] = useState(false);

  function handleShowMore() {
    setShowMorePost(!showMorePost);
  }

  useEffect(() => {
    if (!editMode) {
      const contentHeight = postContentRef.current?.clientHeight ?? 0;
      const wrapperHeight = postContentWrapperRef.current?.clientHeight ?? 0;
      setLongPost(contentHeight > wrapperHeight);
    }
  }, [editMode, postContent, postContentRef, postContentWrapperRef]);

  return [longPost, showMorePost, setShowMorePost, handleShowMore] as const;
}
