import { useState, useEffect, useRef } from "react";

const CONFIRM_TIMEOUT_MS = 3000;

export function useToggleBtnClick(btnRef) {
  const [btnClickedOnce, setBtnClickedOnce] = useState(false);
  const resetTimerRef = useRef();

  useEffect(() => {
    function handleDocumentClick(e) {
      if (btnRef?.current && !btnRef.current.contains(e.target)) {
        setBtnClickedOnce(false);
      }
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [btnRef]);

  useEffect(() => {
    if (btnClickedOnce) {
      resetTimerRef.current = setTimeout(() => {
        setBtnClickedOnce(false);
      }, CONFIRM_TIMEOUT_MS);
      return () => clearTimeout(resetTimerRef.current);
    }
  }, [btnClickedOnce]);

  return [btnClickedOnce, setBtnClickedOnce];
}
