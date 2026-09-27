import { useState, useEffect, useRef, type RefObject } from "react";

const CONFIRM_TIMEOUT_MS = 3000;

export function useToggleBtnClick(btnRef: RefObject<HTMLElement | null>) {
  const [btnClickedOnce, setBtnClickedOnce] = useState(false);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleDocumentClick(e: MouseEvent) {
      if (btnRef?.current && !btnRef.current.contains(e.target as Node)) {
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

  return [btnClickedOnce, setBtnClickedOnce] as const;
}
