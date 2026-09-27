import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { ExitSVG } from "@/primitives/icons";
import modalStyles from "@/style-modules/components/modals.module.css";

export function Modal({ onClose, cardClassName, overlayStyle, children }) {
  const cardRef = useRef();

  function handleOverlayClick(event) {
    if (event.target !== cardRef.current) onClose();
  }

  return ReactDOM.createPortal(
    <>
      <div
        className={modalStyles.modalOverlay}
        onClick={handleOverlayClick}
        style={overlayStyle}
      ></div>
      <div ref={cardRef} className={cardClassName || modalStyles.modalCard}>
        <button className={modalStyles.exitBtn} onClick={onClose}>
          <ExitSVG color="#7c606b" height="15px" width="15px" />
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal-root")
  );
}
