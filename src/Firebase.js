// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Remplace ces informations par les tiennes depuis la console Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCyCSRhHtwjLpSnZPxRwzF0feVuPxPvB6s",
    authDomain: "network-app-5a497.firebaseapp.com",
    projectId: "network-app-5a497",
    storageBucket: "network-app-5a497.appspot.com",
    messagingSenderId: "824597095593",
    appId: "1:824597095593:web:f914e09f443e2133d875b8"
  };
// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Firestore
const db = getFirestore(app);

export { auth, db }; // Export auth and db for use in your components