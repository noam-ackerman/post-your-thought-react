import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    setTimeout(function () {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 100);
  }, [pathname]);

  return null;
}
