import { Heading, Button, Modal } from "@/components/atoms";
import modalStyles from "@/style-modules/components/modals.module.css";

interface LogoutConfirmModalProps {
  toggleModal: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ toggleModal, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Modal onClose={toggleModal}>
      <Heading level="secondary">Log Out</Heading>
      <p className={modalStyles.confirmText}>
        Are you sure you want to log out?
      </p>
      <div className={modalStyles.confirmActions}>
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button color="danger" onClick={onConfirm}>
          Log Out
        </Button>
      </div>
    </Modal>
  );
}
