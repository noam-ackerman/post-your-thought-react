import { useRef, type CSSProperties, type ReactNode, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { XmarkSVG } from "../icons";
import modalStyles from "./modal.module.css";
import sharedModalStyles from "@/style-modules/components/modals.module.css";

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
        <button className={sharedModalStyles.exitBtn} onClick={onClose}>
          <XmarkSVG color="var(--color-plum)" height="22px" width="22px" />
        </button>
        {children}
      </div>
    </>,
    document.getElementById("modal-root")!
  );
}
