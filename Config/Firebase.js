import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBxIjIHO_xky0kX7MkmlEDMV_AkjThgog8",
  authDomain: "indoorxyz.firebaseapp.com",
  projectId: "indoorxyz",
  storageBucket: "indoorxyz.appspot.com", // Corrected storage bucket domain
  messagingSenderId: "1036065165143",
  appId: "1:1036065165143:web:1ed1f9cb9a24486b27f812",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Connect to emulators (optional, for local development)
if (__DEV__) {
  // Uncomment the following lines if using Firebase emulators
  // connectAuthEmulator(auth, 'http://localhost:9099');
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectStorageEmulator(storage, 'localhost', 9199');
  console.log('Firebase connected to emulators');
}

// Log success
console.log('Firebase initialized successfully');

// Export Firebase instances
export { app, auth, db, storage };

// Utility function to check if Firebase is initialized
export const isFirebaseInitialized = () => app && auth && db;
