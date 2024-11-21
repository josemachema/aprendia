import React, { useState, useEffect } from "react";
import { FiUpload, FiSave, FiLock } from "react-icons/fi";
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Asegúrate de ajustar la ruta

const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: "",
    preferences: {
      activeReflective: 50,
      visualVerbal: 50,
      sequentialGlobal: 50,
    },
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // Obtener datos del perfil del usuario desde Firebase
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userDoc = await getDoc(doc(collection(db, "usuarios"), userId));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData({
            ...userData,
            name: data.fullName || "", // Usamos "fullName" según la estructura de Firestore
            email: data.email || "",
            profileImage: data.profileImage || "",
            preferences: data.preferences || {
              activeReflective: 50,
              visualVerbal: 50,
              sequentialGlobal: 50,
            },
          });
        }
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserData();
  }, [userId]);

  // Manejar la carga de imagen de perfil
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData({ ...userData, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Actualizar preferencias de aprendizaje
  const handlePreferenceChange = (type, value) => {
    setUserData({
      ...userData,
      preferences: { ...userData.preferences, [type]: value },
    });
  };

  // Guardar cambios en Firebase
  const handleSave = async () => {
    try {
      setLoading(true);
      const userRef = doc(collection(db, "usuarios"), userId);
      await updateDoc(userRef, {
        fullName: userData.name, // Guardamos el valor de "name" en "fullName"
        profileImage: userData.profileImage,
        preferences: userData.preferences,
      });
      alert("Cambios guardados con éxito.");
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Error al guardar los cambios.");
    } finally {
      setLoading(false);
    }
  };

  // Cambiar contraseña
  const handlePasswordChange = async () => {
    if (userData.newPassword === userData.confirmPassword) {
      try {
        setLoading(true);
        const userRef = doc(collection(db, "usuarios"), userId);
        await updateDoc(userRef, {
          password: userData.newPassword,
        });
        alert("Contraseña actualizada con éxito.");
      } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        alert("Error al cambiar la contraseña.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Las contraseñas no coinciden.");
    }
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#4A90E2]">Perfil de Usuario</h1>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img
                src={userData.profileImage || "https://via.placeholder.com/150"}
                alt="Perfil"
                className="w-32 h-32 rounded-full object-cover"
              />
              <label className="absolute bottom-0 right-0 bg-[#4A90E2] p-2 rounded-full cursor-pointer">
                <FiUpload className="text-white" />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9E9E9E]">Nombre Completo</label>
                <input
                  type="text"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9E9E9E]">Correo Electrónico</label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-[#4A90E2] mb-4">Preferencias de Aprendizaje</h2>
          <div className="space-y-6">
            {["activeReflective", "visualVerbal", "sequentialGlobal"].map((pref) => (
              <div key={pref}>
                <label className="block text-sm font-medium text-[#9E9E9E] mb-2">
                  {pref.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userData.preferences[pref]}
                  onChange={(e) => handlePreferenceChange(pref, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-[#4A90E2] mb-4">Seguridad</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9E9E9E]">Nueva Contraseña</label>
              <input
                type="password"
                value={userData.newPassword}
                onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#9E9E9E]">Confirmar Contraseña</label>
              <input
                type="password"
                value={userData.confirmPassword}
                onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
              />
            </div>
            <button
              onClick={handlePasswordChange}
              className="mt-4 bg-[#FF9800] text-white px-4 py-2 rounded-md hover:bg-[#F57C00]"
            >
              Cambiar Contraseña
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD]"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
