'use client'
import { User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { createContext } from "react";
import { FirebaseAuthContext } from "./FirebaseContext";

export const UserDataContext = createContext<User>(null);
export function UserDataProvider({children}){
  const [user, setUser] = React.useState<User>(null);
  const auth = React.useContext(FirebaseAuthContext);

  React.useEffect(() => {
    if(!auth) return;
    if(auth.currentUser) setUser(auth.currentUser);
    onAuthStateChanged(auth, user => {
      if(user) setUser(user);
      else setUser(null);
    })
  }, [auth]);

  return(
    <UserDataContext.Provider value={user}>
        {children}
    </UserDataContext.Provider>
  )
}