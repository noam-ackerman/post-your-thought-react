import React from "react";

export default function useToggleModal() {
  const [modalOpen, setModalOpen] = React.useState(false);

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  React.useEffect(() => {
    modalOpen
      ? document.querySelector("body").classList.add("modal-open")
      : document.querySelector("body").classList.remove("modal-open");
  }, [modalOpen]);

  return [modalOpen, toggleModal];
}
