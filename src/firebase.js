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
  apiKey: "AIzaSyAlXZEKJ-OcrLs_n7QEiOi7Ft0MbGdU-q0",
  authDomain: "manuscriptor-89ff4.firebaseapp.com",
  projectId: "manuscriptor-89ff4",
  storageBucket: "manuscriptor-89ff4.appspot.com",
  messagingSenderId: "896627881435",
  appId: "1:896627881435:web:30ea017bbe7bb1ac0163fe",
  measurementId: "G-W7S9FLXN60",
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
