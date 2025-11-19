import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";       // PENTRU AUTENTIFICARE
import { getFirestore } from "firebase/firestore"; // PENTRU TODOLIST

// COPIEAZĂ ȘI LIIPEȘTE OBIECTUL DE CONFIGURARE DE MAI SUS
const firebaseConfig = {
  apiKey: "AIzaSyAK4g6lAsywFBEXiHi-WCUAWLdCBsKLMIY",
  authDomain: "do-to-list-748db.firebaseapp.com",
  projectId: "do-to-list-748db",
  storageBucket: "do-to-list-748db.appspot.com",
  messagingSenderId: "286017196522",
  appId: "1:286017196522:web:f797cee035031990a8e293",
  measurementId: "G-425MS4N2XE" // Este opțional, dar e bine să-l lași
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);