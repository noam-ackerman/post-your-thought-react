import React, { useState } from "react";
import { useUsersCtx } from "../context/usersContext";
import { Link } from "react-router-dom";
import styles from "../style-modules/style.module.css";

export default function Search() {
  const { usersData } = useUsersCtx();
  const [searchQuery, setsearchQuery] = useState("");
  const [scoredUsers, setScoredUsers] = useState([]);
  const searchInput = React.useRef();

  React.useEffect(() => {
    if (searchQuery.trim() === "") {
      setScoredUsers([]);
    } else {
      const usersArray = usersData ? Object.values(usersData) : [];
      const filteredUsers = usersArray.filter(
        (user) =>
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setScoredUsers(filteredUsers);
    }
  }, [searchQuery, usersData]);

  function handleChange(e) {
    setsearchQuery(searchInput.current.value);
  }

  return (
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
                <div className={styles.usernameResult}>{user.displayName}</div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
