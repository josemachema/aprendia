import React from 'react';
import { updateDocument } from './updateData';

const App = () => {
  const handleUpdate = async () => {
    const collectionName = 'usuarios'; // Nombre de tu colección
    const documentId = '7nKh6IFlhFJBqGT6RU9S'; // ID del documento a actualizar

    const updatedData = {
      apellido: "Martinez",
      cedula: "12341256",
      courses: [
        "FVIc4Hgf1kR0KuWxRIkS",
        "s634rV2YmZU0rr3ulr9v",
        "55XPEfKEAe4AYWTBui7T",
        "TqMDEG5MJMmwDuDmUSvh",
        "CgkmjL3L7iNAhZtGBcw1"
      ],
      edad: "25",
      email: "juan1@gmail.com",
      genero: "masculino",
      nombre: "juan",
      password: "$2a$10$L.qVyHEFh.BwmViZkRyVdOlnIbXA15fXYtOVTQh3ctEFiVYxtWyx.",
      role: "maestro"
    };

    try {
      await updateDocument(collectionName, documentId, updatedData);
      alert('Datos actualizados correctamente');
    } catch (error) {
      alert('Error al actualizar los datos');
    }
  };

  return (
    <div>
      <h1>Actualizar Datos</h1>
      <button onClick={handleUpdate}>Actualizar Documento</button>
    </div>
  );
};

export default App;
