import React, { useState } from 'react';
import { updateData } from './updateData';

const App = () => {
  const [data, setData] = useState({
    campo1: '',
    campo2: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    const collection = 'miColeccion'; // Nombre de tu colección en Firestore
    const documentId = 'miDocumentoId'; // ID del documento que deseas actualizar

    try {
      await updateData(collection, documentId, data);
      alert('Datos actualizados correctamente');
    } catch (error) {
      alert('Error al actualizar los datos');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Actualizar Datos en Firebase</h1>
      <input
        type="text"
        name="campo1"
        placeholder="Campo 1"
        value={data.campo1}
        onChange={handleInputChange}
      />
      <br />
      <input
        type="text"
        name="campo2"
        placeholder="Campo 2"
        value={data.campo2}
        onChange={handleInputChange}
      />
      <br />
      <button onClick={handleUpdate}>Actualizar Datos</button>
    </div>
  );
};

export default App;
