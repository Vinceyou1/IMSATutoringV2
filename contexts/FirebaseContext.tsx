'use client'
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';
import * as React from 'react';
import { createContext } from 'react';

export const FirebaseAppContext = createContext<FirebaseApp>(null);
export const FirebaseFirestoreContext = createContext<Firestore>(null);
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

  React.useEffect(() => {
    if (!firebaseApp && typeof window !== 'undefined') {
      const firebaseApp =
        getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
      setFirebaseApp(firebaseApp);
      setFirestore(getFirestore(firebaseApp));
    }
  }, []);

  return (
    <FirebaseAppContext.Provider value={firebaseApp}>
    <FirebaseFirestoreContext.Provider value={firestore}>
      {children}
    </FirebaseFirestoreContext.Provider>
    </FirebaseAppContext.Provider>
  );
};