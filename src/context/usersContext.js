import React, { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDatabase,
  ref as databaseRef,
  update,
  onValue,
  remove,
} from "firebase/database";

const UsersContext = React.createContext();
const database = getDatabase();

const useUsersCtx = () => {
  return useContext(UsersContext);
};

const UsersContextProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentUserPosts, setCurrentUserPosts] = useState();
  const [usersData, setUsersData] = useState();
  const [likesData, setLikesData] = useState();

  function updateUserDatabase(data) {
    const userRef = databaseRef(database, "users/" + currentUser.uid);
    return update(userRef, data);
  }

  function deleteUserDatabase() {
    const userRef = databaseRef(database, "users/" + currentUser.uid);
    return remove(userRef);
  }

  function updatePostsLikes(postId, data) {
    const postRef = databaseRef(database, "likes/" + postId);
    return update(postRef, { likes: data });
  }

  function removePostsLikes(postId) {
    const postRef = databaseRef(database, "likes/" + postId);
    return remove(postRef);
  }

  // fetching current user posts from database and setting state

  const fetchingCurrentUserPosts = React.useCallback(() => {
    setCurrentUserPosts();
    const postsRef = databaseRef(
      database,
      "users/" + currentUser.uid + "/posts"
    );
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCurrentUserPosts(data);
      } else {
        setCurrentUserPosts([]);
      }
    });
  }, [currentUser]);

  // fetching all users data from database and setting state

  const fetchingUsers = React.useCallback(() => {
    setUsersData();
    const postsRef = databaseRef(database, "users");
    onValue(postsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUsersData(data);
      } else {
        setUsersData([]);
      }
    });
  }, []);

  // fetching all likes data from database and setting state

  const fetchingLikes = React.useCallback(() => {
    setLikesData();
    const likesRef = databaseRef(database, "likes");
    onValue(likesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLikesData(data);
      } else {
        setLikesData([]);
      }
    });
  }, []);

  //

  let ContextValue = {
    updateUserDatabase,
    currentUserPosts,
    setCurrentUserPosts,
    fetchingCurrentUserPosts,
    usersData,
    setUsersData,
    fetchingUsers,
    deleteUserDatabase,
    likesData,
    fetchingLikes,
    updatePostsLikes,
    removePostsLikes,
  };

  return (
    <UsersContext.Provider value={ContextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersCtx, UsersContextProvider };
