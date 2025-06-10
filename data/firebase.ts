// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxSJv0ma0wzyUP7V994eITfgdFUBunIFo",
  authDomain: "react-portfolio-c71dc.firebaseapp.com",
  projectId: "react-portfolio-c71dc",
  storageBucket: "react-portfolio-c71dc.firebasestorage.app",
  messagingSenderId: "1085158354637",
  appId: "1:1085158354637:web:b014d98841cb719e80c384",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };