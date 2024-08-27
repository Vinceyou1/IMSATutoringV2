'use client'
import { User, onAuthStateChanged } from "firebase/auth";
import React, { PropsWithChildren, ReactNode } from "react";
import { createContext } from "react";
import { FirebaseAuthContext } from "./FirebaseContext";
import Popup from "reactjs-popup";
import './popup.css'

export const UserDataContext = createContext<[User | null, boolean]>([null, true]);
export function UserDataProvider({children}: {children: ReactNode}){
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const auth = React.useContext(FirebaseAuthContext);
  const [badEmail, updateBadEmail] = React.useState(false);

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
        if(user){
          setUser(user);
          if(user.email?.slice(user.email?.indexOf("@")) != "@imsa.edu"){
            updateBadEmail(true)
            setUser(null);
            auth.signOut();
          }
        }
        else setUser(null);
      })
    }
    handleuser();
  }, [auth]);

  return(
    <UserDataContext.Provider value={[user, loading]}>
      <Popup
        open={badEmail}
        modal
        onClose={() => updateBadEmail(false)}
        closeOnDocumentClick
      >
        <div className="modal flex flex-col justify-center bg-primary dark:bg-primary-dark border-2 rounded-lg">
          <div className="text-center p-0 text-3xl">
            Please Sign in With Your IMSA Email
          </div>
        </div>
      </Popup>
      {children}
    </UserDataContext.Provider>
  )
}