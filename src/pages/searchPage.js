import React, { useState } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { useUsersCtx } from "../context/usersContext";
import styles from "../style-modules/style.module.css";
import { Link } from "react-router-dom";

export default function Search() {
  const { usersData, fetchingUsers } = useUsersCtx();
  const usersArray = React.useMemo(
    () => (usersData ? Object.values(usersData) : []),
    [usersData]
  );
  const [searchQuery, setsearchQuery] = useState("");
  const [scoredUsers, setScoredUsers] = useState([]);
  const searchInput = React.useRef();

  React.useEffect(() => {
    fetchingUsers();
  }, [fetchingUsers]);

  React.useEffect(() => {
    if (searchQuery === "") {
      setScoredUsers([]);
    } else {
      const filteredUsers = usersArray.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setScoredUsers(filteredUsers);
    }
  }, [searchQuery, usersArray]);

  function handleChange(e) {
    setsearchQuery(searchInput.current.value);
  }

  return (
    <>
      <Navbar />
      <div className={styles.SearchPageContainter}>
        <div className={styles.SearchTitle}>Search Users</div>
        <input
          className={styles.searchInput}
          type="text"
          ref={searchInput}
          name="search"
          placeholder="Search username/email"
          onChange={handleChange}
        />
        <div className={styles.searchResultsWrapper}>
          {scoredUsers.length > 0 &&
            scoredUsers.map((user, index) => {
              return (
                <Link
                  to={`/${user.userId}`}
                  key={index}
                  className={styles.userCard}
                >
                  <div className={styles.profileImgLargerThumbnailWrapper}>
                    <img
                      className={styles.profileImgThumbnail}
                      src={user.photoURL}
                      alt={user.email}
                    />
                  </div>
                  <div className={styles.usernameResult}>
                    {user.displayName}
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
      <Footer />
    </>
  );
}
