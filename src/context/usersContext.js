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
    if (currentUser) {
      const userRef = databaseRef(database, "users/" + currentUser.uid);
      return update(userRef, data);
    } else {
      return;
    }
  }

  function deleteUserDatabase() {
    if (currentUser) {
      const userRef = databaseRef(database, "users/" + currentUser.uid);
      return remove(userRef);
    } else {
      return;
    }
  }

  function updatePostsLikes(postId, data) {
    const postRef = databaseRef(database, "likes/" + postId);
    return update(postRef, { likes: data });
  }
  function removePostsLikes(postId) {
    const postRef = databaseRef(database, "likes/" + postId);
    return remove(postRef);
  }

  // getting current user posts from database and setting state

  React.useEffect(() => {
    if (currentUser) {
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
    } else if (!currentUser) {
      setCurrentUserPosts();
    }
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
