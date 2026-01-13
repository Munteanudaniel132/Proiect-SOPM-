import { initializeApp } from "firebase/app";
import {
    initializeAuth,
    getReactNativePersistence,
    GoogleAuthProvider
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBi9MSuxPLKRUhpLDZT1rUjs291w3YWWmw",
    authDomain: "todo-app-48a7f.firebaseapp.com",
    projectId: "todo-app-48a7f",
    storageBucket: "todo-app-48a7f.firebasestorage.app",
    messagingSenderId: "1057879860300",
    appId: "1:1057879860300:web:cb1f631519467dcb9140e9",
    measurementId: "G-2CMV14SGXC"
};

// Inițializăm aplicația
const app = initializeApp(firebaseConfig);

// MODIFICARE: Folosim initializeAuth în loc de getAuth pentru a activa AsyncStorage.
// Acest lucru rezolvă eroarea galbenă din terminal și păstrează userul logat.
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const analytics = getAnalytics(app);