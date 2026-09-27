import { useState, useEffect } from "react";

export function useToggleModal() {
  const [modalOpen, setModalOpen] = useState(false);

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [modalOpen]);

  return [modalOpen, toggleModal] as const;
}
