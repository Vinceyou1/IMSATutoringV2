'use client'
import { User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import { createContext } from "react";
import { FirebaseAuthContext } from "./FirebaseContext";

export const UserDataContext = createContext<[User, boolean]>(null);
export function UserDataProvider({children}){
  const [user, setUser] = React.useState<User>(null);
  const [loading, setLoading] = React.useState(true);
  const auth = React.useContext(FirebaseAuthContext);

  React.useEffect(() => {
    const handleuser = async () => {
      if(!auth) return;
      await auth.authStateReady().then(() => {
        if(auth.currentUser){
          setUser(auth.currentUser);
        }
        setLoading(false);
      });
      onAuthStateChanged(auth, user => {
        if(user) setUser(user);
        else setUser(null);
      })
    }
    handleuser();
  }, [auth]);

  return(
    <UserDataContext.Provider value={[user, loading]}>
      {children}
    </UserDataContext.Provider>
  )
}