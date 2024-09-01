// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqrhV1pM3CPskdfzkqIxpvGcXpSN1TTC8",
  authDomain: "quanlybaidoxe-aed6a.firebaseapp.com",
  projectId: "quanlybaidoxe-aed6a",
  storageBucket: "quanlybaidoxe-aed6a.appspot.com",
  messagingSenderId: "700452149735",
  appId: "1:700452149735:web:15de75c50c875b2a7e4542"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore, signInWithEmailAndPassword };
