// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA--A1JJJsuj2FYCC5y-v8KjEPvUgKg1uI",
  authDomain: "crecer-2025.firebaseapp.com",
  databaseURL: "https://crecer-2025-default-rtdb.firebaseio.com",
  projectId: "crecer-2025",
  storageBucket: "crecer-2025.firebasestorage.app",
  messagingSenderId: "759739358419",
  appId: "1:759739358419:web:2d05b25d0b3022bd1f8826",
  measurementId: "G-H92M1BM0H1"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Exporta db como predeterminado
export default db;