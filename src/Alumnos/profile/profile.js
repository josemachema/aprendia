import React, { useState } from "react";
import { FiUpload, FiSave, FiLock } from "react-icons/fi";
import { BiUser } from "react-icons/bi";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "Juan García Martínez",
    email: "juan.garcia@ejemplo.com",
    profileImage: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150",
    preferences: {
      activeReflective: 50,
      visualVerbal: 50,
      sequentialGlobal: 50
    },
    password: "",
    newPassword: "",
    confirmPassword: ""
  });

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

  const handlePreferenceChange = (type, value) => {
    setUserData({
      ...userData,
      preferences: { ...userData.preferences, [type]: value }
    });
  };

  const handleSave = () => {
    console.log("Guardando cambios:", userData);
  };

  const handlePasswordChange = () => {
    if (userData.newPassword === userData.confirmPassword) {
      console.log("Contraseña actualizada");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#4A90E2]">Perfil de Usuario</h1>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
          <div className="flex items-start space-x-6">
            <div className="relative">
              <img
                src={userData.profileImage}
                alt="Perfil"
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150";
                }}
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
            <div>
              <label className="block text-sm font-medium text-[#9E9E9E] mb-2">
                Activo - Reflexivo
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={userData.preferences.activeReflective}
                onChange={(e) => handlePreferenceChange("activeReflective", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-[#9E9E9E]">
                <span>Activo</span>
                <span>Reflexivo</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9E9E9E] mb-2">
                Visual - Verbal
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={userData.preferences.visualVerbal}
                onChange={(e) => handlePreferenceChange("visualVerbal", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-[#9E9E9E]">
                <span>Visual</span>
                <span>Verbal</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9E9E9E] mb-2">
                Secuencial - Global
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={userData.preferences.sequentialGlobal}
                onChange={(e) => handlePreferenceChange("sequentialGlobal", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-[#9E9E9E]">
                <span>Secuencial</span>
                <span>Global</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#F5F5F5] p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-[#4A90E2] mb-4">Seguridad</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#9E9E9E]">Contraseña Actual</label>
              <input
                type="password"
                value={userData.password}
                onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#4A90E2] focus:ring-[#4A90E2]"
              />
            </div>
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
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF9800] hover:bg-[#F57C00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF9800]"
            >
              <FiLock className="mr-2" /> Cambiar Contraseña
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A90E2] hover:bg-[#357ABD] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2]"
        >
          <FiSave className="mr-2" /> Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default UserProfile;