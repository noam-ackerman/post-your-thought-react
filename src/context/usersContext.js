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
const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/post-auth-prod-e5bab.appspot.com/o/defaultAvatar.png?alt=media&token=1d3ad769-659c-4a80-bf48-2699da7b2fb5";

const useUsersCtx = () => {
  return useContext(UsersContext);
};

const UsersContextProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [usersData, setUsersData] = useState();
  const [likesData, setLikesData] = useState();
  const [currentUserData, setCurrentUserData] = useState();

  // storage

  async function UploadImageToStorageAndGetUrl(imgFile) {
    const fileRef = ref(
      storage,
      "images/" + currentUser.uid + "/" + imgFile.name
    );
    try {
      await uploadBytes(fileRef, imgFile);
      return getDownloadURL(fileRef);
    } catch {
      return alert("Failed to upload image!");
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
      .catch((err) => {
        return new Error();
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

  function updatePostsLikes(postId, data) {
    const postRef = databaseRef(database, "likes/" + postId);
    return update(postRef, { likes: data });
  }

  function removePostsLikes(postId) {
    const postRef = databaseRef(database, "likes/" + postId);
    return remove(postRef);
  }

  // fetching users , current user and likes data from database

  React.useEffect(() => {
    if (currentUser) {
      // current user data
      const userRef = databaseRef(database, "users/" + currentUser.uid);
      onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCurrentUserData(data);
        } else {
          setCurrentUserData({});
        }
      });
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

      // all users data
      const usersRef = databaseRef(database, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setUsersData(data);
        } else {
          setUsersData({});
        }
      });

      // likes data
      const likesRef = databaseRef(database, "likes");
      onValue(likesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setLikesData(data);
        } else {
          setLikesData({});
        }
      });
    } else if (!currentUser) {
      setCurrentUserData();
      setUsersData();
      setLikesData();
    }
  }, [currentUser]);

  //

  let ContextValue = {
    updateUserDatabase,
    usersData,
    setUsersData,
    deleteUserDatabase,
    likesData,
    updatePostsLikes,
    removePostsLikes,
    currentUserData,
    UploadImageToStorageAndGetUrl,
    deleteStorageUser,
  };

  return (
    <UsersContext.Provider value={ContextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export { useUsersCtx, UsersContextProvider };
