import React from "react";
import ProfileAuthenticated from "../components/AuthenticatedUserProfile/ProfileAuthenticated";
import ProfileUnauthenticated from "../components/UnauthenticatedUserProfile/ProfileUnauthenticated";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useUsersCtx } from "../context/usersContext";
import { Hearts } from "react-loader-spinner";
import Navbar from "../components/navbar";
import styles from "../style-modules/style.module.css";

export default function Profile() {
  const { currentUser } = useAuth();
  const { usersData, fetchingUsers } = useUsersCtx();
  const { userId } = useParams();
  const userCurrentlyAuthenticated = userId === currentUser.uid;

  React.useEffect(() => {
    if (!userCurrentlyAuthenticated) {
      fetchingUsers();
    }
  }, [fetchingUsers, userCurrentlyAuthenticated]);

  if (userCurrentlyAuthenticated) {
    return (
      <>
        <Navbar />
        <ProfileAuthenticated />
      </>
    );
  } else {
    if (usersData) {
      const userExist = Object.keys(usersData).includes(userId);

      return (
        <>
          <Navbar />
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
          <Navbar />
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
}
