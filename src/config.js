// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-xbBM5BS2dPy6A8CtcEmDhb9kPRQruOs",
  authDomain: "chat-system-6ad6a.firebaseapp.com",
  DatabaseURL:"https://chat-system-6ad6a-default-rtdb.firebaseio.com",
  projectId: "chat-system-6ad6a",
  storageBucket: "chat-system-6ad6a.appspot.com",
  messagingSenderId: "1097554807023",
  appId: "1:1097554807023:web:ab721436a4f488bff1f31a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app