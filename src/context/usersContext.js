import React, { useContext, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getDatabase,
  ref as databaseRef,
  update,
  onValue,
  remove,
  set,
  get,
  child,
} from "firebase/database";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";

const UsersContext = React.createContext();
const database = getDatabase();
const storage = getStorage();
const defaultAvatarUrl = "https://iili.io/Hrna4x1.png";

const useUsersCtx = () => {
  return useContext(UsersContext);
};

const UsersContextProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [usersData, setUsersData] = useState();
  const [postsData, setPostsData] = useState();
  const [currentUserData, setCurrentUserData] = useState();

  // storage

  async function uploadImageToStorageAndGetUrl(imgFile) {
    const fileRef = ref(
      storage,
      "images/" + currentUser.uid + "/" + imgFile.name
    );
    try {
      await uploadBytes(fileRef, imgFile);
      return getDownloadURL(fileRef);
    } catch {
      return Promise.reject();
    }
  }

  function deleteStorageUser() {
    const ImagesRef = ref(storage, "images/" + currentUser.uid);
    listAll(ImagesRef)
      .then((res) => {
        res.items.forEach((itemRef) => {
          deleteObject(itemRef);
        });
      })
      .catch(() => {
        return new Error("failed to delete user storage data!");
      });
  }

  //database

  function updateUserDatabase(data) {
    const userRef = databaseRef(database, "users/" + currentUser.uid);
    return update(userRef, data);
  }

  function deleteUserDatabase() {
    const userRef = databaseRef(database, "users/" + currentUser.uid);
    return remove(userRef);
  }

  function updatePost(postId, data) {
    const postRef = databaseRef(database, "posts/" + postId);
    return update(postRef, data);
  }

  function removePost(postId) {
    const postRef = databaseRef(database, "posts/" + postId);
    return remove(postRef);
  }

  // fetching users , current user and likes data from database

  React.useEffect(() => {
    if (currentUser) {
      //setting current user in database on first signup
      get(child(databaseRef(database), "users/" + currentUser.uid)).then(
        (snapshot) => {
          if (!snapshot.exists()) {
            set(userRef, {
              userId: currentUser.uid,
              displayName: currentUser.email.split("@")[0],
              email: currentUser.email,
              photoURL: defaultAvatarUrl,
              bio: "",
            });
          }
        }
      );
      // current user data
      const userRef = databaseRef(database, "users/" + currentUser.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setCurrentUserData(data);
        else setCurrentUserData({});
      });

      // all users data
      const usersRef = databaseRef(database, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setUsersData(data);
        else setUsersData({});
      });

      // all posts data
      const postsRef = databaseRef(database, "posts");
      onValue(postsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const sortedPosts = Object.values(data).sort(
            (a, b) => b.date - a.date
          );
          setPostsData(sortedPosts);
        } else {
          setPostsData([]);
        }
      });
    } else if (!currentUser) {
      setCurrentUserData();
      setUsersData();
      setPostsData();
    }
  }, [currentUser]);

  let ContextValue = {
    updateUserDatabase,
    usersData,
    setUsersData,
    deleteUserDatabase,
    postsData,
    updatePost,
    removePost,
    currentUserData,
    uploadImageToStorageAndGetUrl,
    deleteStorageUser,
  };

  return (
    <UsersContext.Provider value={ContextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersCtx, UsersContextProvider };
