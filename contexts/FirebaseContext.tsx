'use client'
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import {
  Firestore,
  getFirestore,
} from 'firebase/firestore';
import * as React from 'react';
import { createContext } from 'react';

export const FirebaseAppContext = createContext<FirebaseApp>(null);
export const FirebaseFirestoreContext = createContext<Firestore>(null);
export const FirebaseAuthContext = createContext<Auth>(null);
const firebaseConfig = {
  apiKey: "AIzaSyCOLiUSqahdU-yhNJ4ccFYHq0iIAvc9MXQ",
  authDomain: "imsa-tutoring.firebaseapp.com",
  databaseURL: "https://imsa-tutoring-default-rtdb.firebaseio.com",
  projectId: "imsa-tutoring",
  storageBucket: "imsa-tutoring.appspot.com",
  messagingSenderId: "839957581925",
  appId: "1:839957581925:web:8d31234c4968fe2c35768c",
  measurementId: "G-646WMNG34C"
};

export const FirebaseProvider = ({ children }) => {
  const [firebaseApp, setFirebaseApp] = React.useState<FirebaseApp>(null);
  const [firestore, setFirestore] = React.useState<Firestore>(null);
  const [auth, setAuth] = React.useState<Auth>(null);

  React.useEffect(() => {
    if (!firebaseApp && typeof window !== 'undefined') {
      const firebaseApp =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      setFirebaseApp(firebaseApp);
      setFirestore(getFirestore(firebaseApp));
      setAuth(getAuth(firebaseApp));
    }
  }, []);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
    <FirebaseFirestoreContext.Provider value={firestore}>
    <FirebaseAuthContext.Provider value={auth}>
      {children}
    </FirebaseAuthContext.Provider>
    </FirebaseFirestoreContext.Provider>
    </FirebaseAppContext.Provider>
  );
};