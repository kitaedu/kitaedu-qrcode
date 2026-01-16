import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// TODO: Replace with your actual Firebase Configuration
// Get this from: Firebase Console > Project Settings > General > Your apps > SDK setup/configuration
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDOPEu_QB3uKOx4SdX48nx4yaeucQe27oI",
    authDomain: "kitaedu-qrcode.firebaseapp.com",
    projectId: "kitaedu-qrcode",
    storageBucket: "kitaedu-qrcode.firebasestorage.app",
    messagingSenderId: "424161303322",
    appId: "1:424161303322:web:8f947ab6ce142074f96aa3",
    measurementId: "G-YBHM5TC9C0"
};

let app;
let db;

try {
    app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Firebase initialization failed. Please check your config in src/firebase.js", error);
}

export { db };
