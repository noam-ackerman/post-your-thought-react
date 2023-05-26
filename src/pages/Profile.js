import React from "react";
import ProfileAuthenticated from "../components/AuthenticatedUserProfile/ProfileAuthenticated";
import ProfileUnauthenticated from "../components/UnauthenticatedUserProfile/ProfileUnauthenticated";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsersCtx } from "../context/usersContext";
import { Hearts } from "react-loader-spinner";
import styles from "../style-modules/style.module.css";

export default function Profile() {
  const { currentUser } = useAuth();
  const { usersData, likesData, currentUserData } = useUsersCtx();
  const { userId } = useParams();
  const userCurrentlyAuthenticated = userId === currentUser.uid;

  if (userCurrentlyAuthenticated && likesData && currentUserData) {
    return <ProfileAuthenticated />;
  } else if (!userCurrentlyAuthenticated && usersData && likesData) {
    const userExist = Object.keys(usersData).includes(userId);
    return (
      <>
        {userExist ? (
          <ProfileUnauthenticated user={usersData[userId]} />
        ) : (
          <Navigate to="/" />
        )}
      </>
    );
  } else {
    return (
      <>
        <Hearts
          height="200"
          width="200"
          color="#B5A1FF"
          ariaLabel="hearts-loading"
          wrapperStyle={{}}
          wrapperClass={styles.heartsPageLoader}
          visible={true}
        />
      </>
    );
  }
}
