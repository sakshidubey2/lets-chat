import { initializeApp } from "firebase/app";
import { getAuth, signOut, signInWithPopup, onAuthStateChanged, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, getDocs, where, getDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAforGOxFA0-toN9aWCiYxTU15hsO-jbIY",
    authDomain: "real-time-chat-app-47c2a.firebaseapp.com",
    databaseURL: "https://real-time-chat-app-47c2a-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "real-time-chat-app-47c2a",
    storageBucket: "real-time-chat-app-47c2a.appspot.com",
    messagingSenderId: "570609350702",
    appId: "1:570609350702:web:4a79c0a4ca55f05af1c7bf",
    measurementId: "G-9EEQ510RDW"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signOut, signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword };
export { db, collection, onSnapshot, addDoc, setDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp, getDocs, where, getDoc };