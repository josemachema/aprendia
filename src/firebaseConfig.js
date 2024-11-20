// Importa la biblioteca de Firebase
import { initializeApp } from "firebase/app";

// Tu configuración de Firebase corregida
const firebaseConfig = {
  apiKey: "AIzaSyBZrNoGRaxgPiuFquT7IRzKnebSNijE7ME",
  authDomain: "proyectonacional-9ac68.firebaseapp.com",
  projectId: "proyectonacional-9ac68",
  storageBucket: "proyectonacional-9ac68.appspot.com", // Corregido
  messagingSenderId: "847022716640",
  appId: "1:847022716640:web:4bf51125d3e8f04a5d8285",
  measurementId: "G-X98RJHN1HC"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export default app;
