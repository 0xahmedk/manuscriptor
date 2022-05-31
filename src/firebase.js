// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  collection,
  getFirestore,
  //   getDocs,
  //   addDoc,
  //   doc,
} from "firebase/firestore";

import { getStorage, ref } from "firebase/storage";

import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBM6MYnv53YnqXLRGTS70DTlPWyLMlKZ3o",
  authDomain: "manuscriptor-new.firebaseapp.com",
  projectId: "manuscriptor-new",
  storageBucket: "manuscriptor-new.appspot.com",
  messagingSenderId: "1064653930035",
  appId: "1:1064653930035:web:5c338203e0766445a9ad46",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore();

const auth = getAuth();

const storage = getStorage(app);

const papersColRef = collection(db, "papers");
const usersColRef = collection(db, "users");

export {
  auth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  storage,
  ref,
  papersColRef,
  usersColRef,
  db,
};

// const colRef = collection()
