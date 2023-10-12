import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsersCtx } from "../context/usersContext";
import { HeartsPageLoader } from "../utilities/spinners";
import ProfileBlockAuthenticated from "../components/AuthenticatedUserProfile/ProfileBlockAuthenticated";
import PostsSectionAuthenticated from "../components/AuthenticatedUserProfile/PostsSectionAuthenticated";
import ProfileBlockUnauthenticated from "../components/UnauthenticatedUserProfile/ProfileBlockUnauthenticated";
import PostsSectionUnauthenticated from "../components/UnauthenticatedUserProfile/PostsSectionUnauthenticated";
import styles from "../style-modules/style.module.css";

export default function Profile() {
  const { currentUser } = useAuth();
  const { usersData, postsData, currentUserData } = useUsersCtx();
  const { userId } = useParams();
  const userCurrentlyAuthenticated = userId === currentUser.uid;

  if (userCurrentlyAuthenticated && postsData && currentUserData) {
    return (
      <div className={styles.profileContainerContent}>
        <ProfileBlockAuthenticated />
        <PostsSectionAuthenticated />
      </div>
    );
  } else if (!userCurrentlyAuthenticated && postsData && usersData) {
    const userExist = Object.keys(usersData).includes(userId);
    return (
      <>
        {userExist ? (
          <div className={styles.profileContainerContent}>
            <ProfileBlockUnauthenticated user={usersData[userId]} />
            <PostsSectionUnauthenticated user={usersData[userId]} />
          </div>
        ) : (
          <Navigate to="/" />
        )}
      </>
    );
  } else {
    return <HeartsPageLoader />;
  }
}
