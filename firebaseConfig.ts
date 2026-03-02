import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBBIWK_AUR1fNKxHbtc6ZDJe2-PhHSy5oc",
  authDomain: "omrscanner-2a2dc.firebaseapp.com",
  projectId: "omrscanner-2a2dc",
  storageBucket: "omrscanner-2a2dc.firebasestorage.app",
  messagingSenderId: "815284478180",
  appId: "1:815284478180:web:af871ab8e451bab1ceccf1"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getFirestore(app);
