import { useState, useEffect, useCallback } from "react";

export default function useToggleBtnClick(btnRef) {
  const [btnClickedOnce, setBtnClickedOnce] = useState(false);

  const handleDocumentClick = useCallback(
    (e) => {
      if (btnClickedOnce && e.target !== btnRef) {
        setBtnClickedOnce(false);
      }
    },
    [btnClickedOnce, btnRef]
  );

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, [handleDocumentClick]);

  return [btnClickedOnce, setBtnClickedOnce];
}
