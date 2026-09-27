import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUsersCtx } from "@/context/UsersContext";
import { UpdateSettingsModal } from "@/components/modals/UpdateSettingsModal";
import { LogoutConfirmModal } from "@/components/modals/LogoutConfirmModal";
import { useToggleModal } from "@/utilities/customHooks/useToggleModal";
import {
  Avatar,
  Button,
  LogoutSVG,
  SettingsSVG,
  HomeSVG,
  SearchSVG,
} from "@/components/atoms";
import styles from "@/style-modules/global.module.css";
import navbarStyles from "@/style-modules/components/navbar.module.css";

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, LogoutUser } = useAuth();
  const [settingsModalOpen, toggleSettingsModal] = useToggleModal();
  const [logoutModalOpen, toggleLogoutModal] = useToggleModal();
  const { currentUserData } = useUsersCtx();

  async function handleLogout() {
    try {
      await LogoutUser();
      navigate("/login");
    } catch {
      alert("Failed to log out!");
    }
  }

  return (
    <div className={navbarStyles.container}>
      <div className={navbarStyles.MainTitle}>
        <Link to="/">Post Your Thought.</Link>
      </div>
      <div className={styles.actionWrapper}>
        <div className={navbarStyles.username}>
          Hi {currentUserData?.displayName || currentUser?.displayName}{" "}
          <span>(✧ω✧)☆</span>
        </div>
        <Avatar
          to={`/${currentUserData?.userId}`}
          src={currentUserData?.photoURL}
          alt={currentUserData?.displayName}
          className={navbarStyles.profileImage}
        />
        <Link to="/" title="Homepage" className={styles.actionButtonPrimary}>
          <HomeSVG color="var(--color-white)" height="22px" width="22px" />
        </Link>
        <Link
          to="/search-users"
          title="Search Users"
          className={styles.actionButtonPrimary}
        >
          <SearchSVG color="var(--color-white)" height="23px" width="23px" />
        </Link>
        <Button onClick={toggleSettingsModal} title="Settings">
          <SettingsSVG color="var(--color-white)" height="21px" width="21px" />
        </Button>
        <Button title="Log Out" onClick={toggleLogoutModal}>
          <LogoutSVG color="var(--color-white)" height="20px" width="20px" />
        </Button>
      </div>
      {settingsModalOpen && (
        <UpdateSettingsModal toggleModal={toggleSettingsModal} />
      )}
      {logoutModalOpen && (
        <LogoutConfirmModal
          toggleModal={toggleLogoutModal}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
