import { useState, useMemo, type ChangeEvent } from "react";
import { useUsersCtx } from "@/context/UsersContext";
import { Link } from "react-router-dom";
import { HeartsPageLoader } from "@/components/atoms";
import searchPageStyles from "@/style-modules/pages/searchPage.module.css";

export function SearchPage() {
  const { usersData } = useUsersCtx();
  const [searchQuery, setsearchQuery] = useState("");

  const scoredUsers = useMemo(() => {
    if (searchQuery.trim() === "") return [];
    return Object.values(usersData ?? {}).filter(
      (user) =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        user.displayName
          .toLowerCase()
          .includes(searchQuery.toLowerCase().trim())
    );
  }, [usersData, searchQuery]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setsearchQuery(e.target.value);
  }

  return (
    <>
      {usersData ? (
        <div className={searchPageStyles.containter}>
          <div className={searchPageStyles.title}>Search Users</div>
          <input
            className={searchPageStyles.input}
            type="text"
            name="search"
            placeholder="Search username/email"
            onChange={handleChange}
            autoComplete="off"
          />
          <div className={searchPageStyles.wrapper}>
            {scoredUsers.length > 0 &&
              scoredUsers.map((user, index) => {
                return (
                  <Link
                    to={`/${user.userId}`}
                    key={index}
                    className={searchPageStyles.card}
                  >
                    <div className={searchPageStyles.userImgThumbnailWrapper}>
                      <img
                        className={searchPageStyles.userImgThumbnail}
                        src={user.photoURL}
                        alt={user.email}
                      />
                    </div>
                    <div className={searchPageStyles.username}>
                      {user.displayName}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      ) : (
        <HeartsPageLoader />
      )}
    </>
  );
}
