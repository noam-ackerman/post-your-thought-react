import type { RefObject } from "react";

const formatDate = (date: number): string => {
  let newDate = new Date(date);
  let year = newDate.getFullYear(),
    month = ("0" + (newDate.getMonth() + 1)).slice(-2),
    day = ("0" + newDate.getDate()).slice(-2),
    hour = ("0" + newDate.getHours()).slice(-2),
    minutes = ("0" + newDate.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  return time;
};

const handleLike = (
  heartRef: RefObject<HTMLDivElement | null>,
  postLikes: string[],
  currentUserId: string,
  postId: string,
  updatePost: (postId: string, data: { likes: string[] }) => Promise<void>
): void => {
  let data;
  if (heartRef.current?.getAttribute("data-action") === "like") {
    data = [...postLikes, currentUserId];
  } else if (heartRef.current?.getAttribute("data-action") === "unlike") {
    data = postLikes.filter((x) => x !== currentUserId);
  }
  updatePost(postId, { likes: data ?? postLikes }).catch(() =>
    alert("Something went wrong!")
  );
};

export { formatDate, handleLike };
