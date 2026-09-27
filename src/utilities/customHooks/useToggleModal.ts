import { useState, useEffect, useRef } from "react";

export function useToggleModal() {
  const [modalOpen, setModalOpen] = useState(false);
  const scrollYRef = useRef(0);

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    if (modalOpen) {
      scrollYRef.current = window.scrollY;
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.top = "";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [modalOpen]);

  return [modalOpen, toggleModal] as const;
}
