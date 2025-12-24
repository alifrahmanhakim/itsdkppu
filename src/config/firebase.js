// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCqr_jQW1ZxMuBjLDmDsoSZA8RKF-kjHO0",
    authDomain: "airtrack-c7979.firebaseapp.com",
    projectId: "airtrack-c7979",
    storageBucket: "airtrack-c7979.firebasestorage.app",
    messagingSenderId: "1090515897511",
    appId: "1:1090515897511:web:242b35d077feaef7599f82",
    measurementId: "G-SM5XYPL94F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { db, analytics, googleProvider };
