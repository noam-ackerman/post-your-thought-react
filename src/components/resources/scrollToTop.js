import { useEffect } from "react";

export default function ScrollToTop(props) {
  useEffect(() => {
    if (props.posts) {
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }, 1);
    }
  }, [props.posts]);

  return null;
}
