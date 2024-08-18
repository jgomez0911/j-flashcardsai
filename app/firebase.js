// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDqL6krSE1T_Y6fccCdCBTW9fPkJzhAapM",
  authDomain: "flashcards-8a156.firebaseapp.com",
  projectId: "flashcards-8a156",
  storageBucket: "flashcards-8a156.appspot.com",
  messagingSenderId: "36879964998",
  appId: "1:36879964998:web:52c68ad28e01798bf36347",
  measurementId: "G-QHH7939N36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };