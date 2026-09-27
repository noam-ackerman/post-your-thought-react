import { useRef, type CSSProperties, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { ExitSVG } from "@/primitives/icons";
import modalStyles from "@/style-modules/components/modals.module.css";

interface ModalProps {
  onClose: () => void;
  cardClassName?: string;
  overlayStyle?: CSSProperties;
  children: ReactNode;
}

export function Modal({ onClose, cardClassName, overlayStyle, children }: ModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target !== cardRef.current) onClose();
  }

  return createPortal(
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
    document.getElementById("modal-root")!
  );
}
