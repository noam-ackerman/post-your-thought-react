import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUsersCtx } from "@/context/UsersContext";
import { LogoutSVG, SettingsSVG, HomeSVG, SearchSVG } from "@/primitives/icons";
import { UpdateSettingsModal } from "@/components/modals/UpdateSettingsModal";
import { useToggleModal } from "@/utilities/customHooks/useToggleModal";
import { Avatar, Button } from "@/atoms";
import styles from "@/style-modules/global.module.css";
import navbarStyles from "@/style-modules/components/navbar.module.css";

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, LogoutUser } = useAuth();
  const [modalOpen, toggleModal] = useToggleModal();
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
          <HomeSVG color="#fff" height="22px" width="22px" />
        </Link>
        <Link
          to="/search-users"
          title="Search Users"
          className={styles.actionButtonPrimary}
        >
          <SearchSVG color="#fff" height="23px" width="23px" />
        </Link>
        <Button onClick={toggleModal} title="Settings">
          <SettingsSVG color="#fff" height="21px" width="21px" />
        </Button>
        <Button title="Log Out" onClick={handleLogout}>
          <LogoutSVG color="#fff" height="20px" width="20px" />
        </Button>
      </div>
      {modalOpen && <UpdateSettingsModal toggleModal={toggleModal} />}
    </div>
  );
}
