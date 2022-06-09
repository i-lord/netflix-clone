// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCbyvh7zvlcaebCcZlmaSNos0wmd1Xo6HI",
    authDomain: "netflix-clone-bb2cd.firebaseapp.com",
    projectId: "netflix-clone-bb2cd",
    storageBucket: "netflix-clone-bb2cd.appspot.com",
    messagingSenderId: "990840015277",
    appId: "1:990840015277:web:952ddc1bbc15afebe27924",
    measurementId: "G-8Z8YZ24QK3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore();
const auth = getAuth()

export default app;
export { db,  auth }