// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAw0ZhIk5AKlGVAEf5iCKchxzUihxjuD8",
  authDomain: "mmories-org-db.firebaseapp.com",
  projectId: "mmories-org-db",
  storageBucket: "mmories-org-db.appspot.com",
  messagingSenderId: "657220970143",
  appId: "1:657220970143:web:aa50367167acbbb36124aa"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
