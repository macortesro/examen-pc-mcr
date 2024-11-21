import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyATjEQDgqb1mJGyATjznf7ltT6uWELclyU",
  authDomain: "examen-pc-mcr.firebaseapp.com",
  projectId: "examen-pc-mcr",
  storageBucket: "examen-pc-mcr.firebasestorage.app",
  messagingSenderId: "245759226327",
  appId: "1:245759226327:web:57106e08bde9ea69fbdb92"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore y Auth
export const db = getFirestore(app);
export const auth = getAuth(app); // Asegúrate de exportar auth
