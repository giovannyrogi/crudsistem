import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import {getAuth} from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDNDXmvfGxj5fZsuFlUxYxOH4bUWXG6v9w",
  authDomain: "crud-kkrpemuda.firebaseapp.com",
  projectId: "crud-kkrpemuda",
  storageBucket: "crud-kkrpemuda.appspot.com",
  messagingSenderId: "359223224372",
  appId: "1:359223224372:web:9b04de0388c5a0995d4261"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);