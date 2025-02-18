import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC03GCqIeEfcYrU4kVDhmYcbwuAgsaG1Ng",
  authDomain: "gym-sw.firebaseapp.com",
  projectId: "gym-sw",
  storageBucket: "gym-sw.firebasestorage.app",
  messagingSenderId: "980021311805",
  appId: "1:980021311805:web:2ccf6c357e1e7db158ed54"
};
  

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs, doc, updateDoc };