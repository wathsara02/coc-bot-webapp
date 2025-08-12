import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Firebase configuration using your existing database URL
const firebaseConfig = {
  databaseURL: "https://coc-keys-default-rtdb.asia-southeast1.firebasedatabase.app",
  // Add other config properties if needed in the future
  projectId: "coc-keys-default",
  storageBucket: "coc-keys-default.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

export default app;