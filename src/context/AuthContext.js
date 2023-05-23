import React, { useContext, useState, useEffect } from "react";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import firebaseApp from "../firebase";
import { getDatabase, ref as databaseRef, set } from "firebase/database";

const auth = getAuth(firebaseApp);
const storage = getStorage();
const database = getDatabase();
const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/post-auth-dev-e4058.appspot.com/o/photography.png?alt=media&token=ee8ac101-275e-496c-9d6e-0cd6159a29f1";

const AuthContext = React.createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [currentUserUpdating, setCurrentUserUpdating] = React.useState(false);
  const [Loading, setLoading] = useState(true);
  const [defaultImageAndNickName, setDefaultImageAndNickname] = useState(false);

  function SignupUser(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function LoginUser(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function LogoutUser() {
    return signOut(auth);
  }
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function DeleteUser() {
    return deleteUser(currentUser);
  }

  function UpdateEmail(email) {
    return updateEmail(currentUser, email);
  }
  function UpdatePassword(password) {
    return updatePassword(currentUser, password);
  }

  function reAuthenticateUser(providedPassword) {
    const credentials = EmailAuthProvider.credential(
      currentUser.email,
      providedPassword
    );
    return reauthenticateWithCredential(currentUser, credentials);
  }

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

  function UpdateProfile(data) {
    return updateProfile(currentUser, data);
  }

  // setting default image and nickname in user object on first login and updating Database
  React.useEffect(() => {
    if (
      currentUser &&
      !defaultImageAndNickName &&
      !currentUser.photoURL &&
      !currentUser.displayName
    ) {
      updateProfile(currentUser, {
        displayName: currentUser.email.split("@")[0],
        photoURL: defaultAvatarUrl,
      }).then(() => {
        setDefaultImageAndNickname(true);
        const userRef = databaseRef(database, "users/" + currentUser.uid);
        set(userRef, {
          userId: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
          bio: "",
        });
      });
    }
  }, [currentUser, defaultImageAndNickName]);

  // unsubscribing from auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const ContextValue = {
    currentUser,
    SignupUser,
    LoginUser,
    LogoutUser,
    resetPassword,
    UpdateEmail,
    UpdatePassword,
    UploadImageToStorageAndGetUrl,
    UpdateProfile,
    DeleteUser,
    deleteStorageUser,
    reAuthenticateUser,
    currentUserUpdating,
    setCurrentUserUpdating,
  };

  return (
    <AuthContext.Provider value={ContextValue}>
      {!Loading && children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthContextProvider };
