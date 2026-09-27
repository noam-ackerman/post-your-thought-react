import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
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
  type User,
} from "firebase/auth";
import { firebaseApp } from "@/firebase";

const auth = getAuth(firebaseApp);
const defaultAvatarUrl = "https://iili.io/Hrna4x1.png";

interface AuthContextValue {
  currentUser: User | null;
  SignupUser: (email: string, password: string) => ReturnType<typeof createUserWithEmailAndPassword>;
  LoginUser: (email: string, password: string) => ReturnType<typeof signInWithEmailAndPassword>;
  LogoutUser: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  UpdateEmail: (email: string) => Promise<void>;
  UpdatePassword: (password: string) => Promise<void>;
  UpdateProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
  DeleteUser: () => Promise<void>;
  reAuthenticateUser: (providedPassword: string) => ReturnType<typeof reauthenticateWithCredential>;
}

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [Loading, setLoading] = useState(true);

  function SignupUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function LoginUser(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function LogoutUser() {
    return signOut(auth);
  }
  function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  function DeleteUser() {
    return deleteUser(currentUser!);
  }

  function UpdateEmail(email: string) {
    return updateEmail(currentUser!, email);
  }
  function UpdatePassword(password: string) {
    return updatePassword(currentUser!, password);
  }

  function reAuthenticateUser(providedPassword: string) {
    const credentials = EmailAuthProvider.credential(
      currentUser!.email!,
      providedPassword
    );
    return reauthenticateWithCredential(currentUser!, credentials);
  }

  function UpdateProfile(data: { displayName?: string; photoURL?: string }) {
    return updateProfile(currentUser!, data);
  }

  // setting default image and nickname in user object on first login

  useEffect(() => {
    if (currentUser && !currentUser.photoURL && !currentUser.displayName) {
      updateProfile(currentUser, {
        displayName: currentUser.email!.split("@")[0],
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

  const ContextValue: AuthContextValue = {
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
