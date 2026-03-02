import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrzXvlL7b8B7P-yv3Ukq8beCkO3iBgzr4",
  authDomain: "omrscanner2.firebaseapp.com",
  projectId: "omrscanner2",
  storageBucket: "omrscanner2.firebasestorage.app",
  messagingSenderId: "562210038183",
  appId: "1:562210038183:web:3dcd5f607d523824419682"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);