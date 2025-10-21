import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCXFg2MD4iF2rMuj4HArLSH39FJsWxtZE",
  authDomain: "miappcrud-26861.firebaseapp.com",
  projectId: "miappcrud-26861",
  storageBucket: "miappcrud-26861.firebasestorage.app",
  messagingSenderId: "500283772039",
  appId: "1:500283772039:web:0996ce74466274aa363c22"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);