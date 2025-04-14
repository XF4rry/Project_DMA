
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPYEFH9F6JwguI4DGTTXXDl0JA6cJZ4mQ",
  authDomain: "spotydma.web.app",
  projectId: "spotydma",
  storageBucket: "spotydma.firebasestorage.app",
  messagingSenderId: "833117624421",
  appId: "1:833117624421:web:e66b3fe3251d82ecb5ce8c",
  measurementId: "G-H2B0CFKM4Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
