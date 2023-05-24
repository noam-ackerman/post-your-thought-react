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
import firebaseApp from "../firebase";

const auth = getAuth(firebaseApp);
const defaultAvatarUrl =
  "https://firebasestorage.googleapis.com/v0/b/post-auth-dev-e4058.appspot.com/o/photography.png?alt=media&token=ee8ac101-275e-496c-9d6e-0cd6159a29f1";

const AuthContext = React.createContext();

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [Loading, setLoading] = useState(true);

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

  function UpdateProfile(data) {
    return updateProfile(currentUser, data);
  }

  // setting default image and nickname in user object on first login

  React.useEffect(() => {
    if (currentUser && !currentUser.photoURL && !currentUser.displayName) {
      updateProfile(currentUser, {
        displayName: currentUser.email.split("@")[0],
        photoURL: defaultAvatarUrl,
      });
    }
  }, [currentUser]);

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
    UpdateProfile,
    DeleteUser,
    reAuthenticateUser,
  };

  return (
    <AuthContext.Provider value={ContextValue}>
      {!Loading && children}
    </AuthContext.Provider>
  );
};

export { useAuth, AuthContextProvider };
