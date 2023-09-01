const formatDate = (date) => {
  let newDate = new Date(date);
  let year = newDate.getFullYear(),
    month = ("0" + (newDate.getMonth() + 1)).slice(-2),
    day = ("0" + newDate.getDate()).slice(-2),
    hour = ("0" + newDate.getHours()).slice(-2),
    minutes = ("0" + newDate.getMinutes()).slice(-2);
  let time = `${day}/${month}/${year} ${hour}:${minutes}`;
  return time;
};

const handleLike = (heartRef, postLikes, currentUserId, postId, updatePost) => {
  let data;
  if (heartRef.current?.getAttribute("action") === "like") {
    data = [...postLikes, currentUserId];
  } else if (heartRef.current.getAttribute("action") === "unlike") {
    data = postLikes.filter((x) => x !== currentUserId);
  }
  updatePost(postId, { likes: data }).catch(() =>
    alert("Something went wrong!")
  );
};

export { formatDate, handleLike };
