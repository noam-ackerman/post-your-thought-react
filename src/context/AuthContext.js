
import React, {useContext, useState, useEffect} from "react";
import {
    getAuth, 
    onAuthStateChanged, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";
import firebaseApp from "../firebase";

const auth = getAuth(firebaseApp);

const AuthContext = React.createContext();

const useAuth = () => {
    return useContext(AuthContext)
}

const AuthContextProvider = ({children}) => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [Loading, setLoading] = useState(true);


    function SignupUser (email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function LoginUser(email, password) {
        return signInWithEmailAndPassword(auth,email, password);
    }

    function LogoutUser () {
        return signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
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
    }
       
   return(
    <AuthContext.Provider value={ContextValue}>
        {!Loading && children}
    </AuthContext.Provider>
   )
}



export {useAuth, AuthContextProvider}