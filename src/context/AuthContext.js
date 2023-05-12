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
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../firebase";

const auth = getAuth(firebaseApp);
const storage = getStorage();

const AuthContext = React.createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [currentUserUpdating, setCurrentUserUpdating] = React.useState(false);
  const [Loading, setLoading] = useState(true);
  const [defaultImageAndNickName, setDefaultImageAndNickname] = useState(false);
  const defaultAvatarUrl =
    "https://firebasestorage.googleapis.com/v0/b/post-auth-dev-e4058.appspot.com/o/photography.png?alt=media&token=ee8ac101-275e-496c-9d6e-0cd6159a29f1";

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

  function UpdateEmail(email) {
    return updateEmail(currentUser, email);
  }
  function UpdatePassword(password) {
    return updatePassword(currentUser, password);
  }

  async function UploadImageToStorageAndGetUrl(imgFile) {
    const fileRef = ref(storage, currentUser.uid + "-" + imgFile.name);
    try {
      await uploadBytes(fileRef, imgFile);
      return getDownloadURL(fileRef);
    } catch {
      return alert("Failed to upload image!");
    }
  }

  function UpdateProfile(data) {
    return updateProfile(currentUser, data);
  }

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
      });
    }
  }, [currentUser, defaultImageAndNickName]);

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
