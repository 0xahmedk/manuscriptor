import { sendPasswordResetEmail } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  colRef,
  db,
} from "../firebase";

const FirebaseContext = React.createContext();

export function useAuth() {
  return useContext(FirebaseContext);
}

export function FirebaseProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  function fileUploadStart(action) {
    setFileUploadLoading(action);
  }

  function setDocs(data) {
    return setDoc(doc(db, "usersData", currentUser.uid), data);
  }

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  //   function resetPassword(email) {
  //     return auth.sendPasswordResetEmail(email);
  //   }

  //   function updateEmail(email) {
  //     return currentUser.updateEmail(email);
  //   }

  //   function updatePassword(password) {
  //     return currentUser.updatePassword(password);
  //   }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    forgotPassword,
    auth,
    fileUploadStart,
    fileUploadLoading,
    setDocs,
    // resetPassword,
    // updateEmail,
    // updatePassword,
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}
