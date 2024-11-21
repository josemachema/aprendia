import React, { useState } from 'react';
import { updateData } from './updateData';

const App = () => {
  const [data, setData] = useState({
    username: '',
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
    const collection = 'usuarios'; // Nombre de tu colección en Firestore
    const documentId = '5Z7XdcuzZphwcD450BNWy3mesD12'; // ID del documento que deseas actualizar

    
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Actualizar Datos en Firebase</h1>
      <input
        type="text"
        name="username"
        placeholder="Campo 1"
        value={data.username}
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
