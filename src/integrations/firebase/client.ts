
// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx_6uthjDJdAdoZ4RZgln1oJtpNJZmflQ",
  authDomain: "jadwalinae-app.firebaseapp.com",
  projectId: "jadwalinae-app",
  storageBucket: "jadwalinae-app.appspot.com",
  messagingSenderId: "962258703185",
  appId: "1:962258703185:web:9b3cf45ed4ef21e47a2a0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Export Firebase app
export const firebase = app;
