
import React, {useContext, useState, useEffect} from "react";
import {getAuth, onAuthStateChanged, createUserWithEmailAndPassword} from "firebase/auth";
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
    }
       
   return(
    <AuthContext.Provider value={ContextValue}>
        {!Loading && children}
    </AuthContext.Provider>
   )
}



export {useAuth, AuthContextProvider}