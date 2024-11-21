import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBZrNoGRaxgPiuFquT7IRzKnebSNijE7ME",
  authDomain: "proyectonacional-9ac68.firebaseapp.com",
  projectId: "proyectonacional-9ac68",
  storageBucket: "proyectonacional-9ac68.appspot.com",
  messagingSenderId: "847022716640",
  appId: "1:847022716640:web:4bf51125d3e8f04a5d8285",
  measurementId: "G-X98RJHN1HC"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// src/components/UpdateData.js
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

const UpdateData = () => {
  const [docId, setDocId] = useState(""); // ID del documento a actualizar
  const [newData, setNewData] = useState(""); // Nuevo valor para actualizar

  const handleUpdate = async () => {
    try {
      // Referencia al documento específico
      const docRef = doc(db, "nombre_de_la_coleccion", docId);

      // Actualiza el documento
      await updateDoc(docRef, {
        campo: newData, // Reemplaza 'campo' con el campo que deseas actualizar
      });

      alert("Documento actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando el documento:", error);
      alert("Hubo un error al actualizar el documento");
    }
  };

  return (
    <div>
      <h2>Actualizar Documento</h2>
      <input
        type="text"
        placeholder="ID del documento"
        value={docId}
        onChange={(e) => setDocId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nuevo valor"
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
      />
      <button onClick={handleUpdate}>Actualizar</button>
    </div>
  );
};

export default UpdateData;
