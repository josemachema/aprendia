import React, { useState } from "react";
import { FiEdit2, FiMail, FiBell, FiLock, FiUpload } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: "Juan Pérez",
    email: "juan.perez@educacion.com",
    password: "",
    newPassword: "",
    confirmPassword: "",
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  });

  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1633332755192-727a05c4013d");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("¡Cambios guardados exitosamente!");
  };

  const validatePassword = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#4A90E2] p-6">
          <h1 className="text-2xl font-bold text-white">Perfil de Usuario</h1>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <img
                src={profileImage}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full object-cover border-4 border-[#4A90E2]"
              />
              <label
                htmlFor="profile-image"
                className="absolute bottom-0 right-0 bg-[#4A90E2] p-2 rounded-full cursor-pointer hover:bg-[#357ABD] transition-colors"
              >
                <FiUpload className="text-white" />
              </label>
              <input
                type="file"
                id="profile-image"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                />
                <FiEdit2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="block w-full px-4 py-3 rounded-md border border-gray-300 bg-gray-50"
                />
                <FiMail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Configuraciones</h2>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FiLock className="text-[#4A90E2]" />
                  <span>Cambiar Contraseña</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingPassword(!isEditingPassword)}
                  className="text-[#4A90E2] hover:text-[#357ABD]"
                >
                  {isEditingPassword ? "Cancelar" : "Editar"}
                </button>
              </div>

              {isEditingPassword && (
                <div className="mt-4 space-y-3">
                  <input
                    type="password"
                    name="password"
                    placeholder="Contraseña actual"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="Nueva contraseña"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirmar nueva contraseña"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-[#4A90E2] focus:border-[#4A90E2]"
                  />
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-4">
                <FiBell className="text-[#4A90E2]" />
                <span>Preferencias de Notificaciones</span>
              </div>

              <div className="space-y-3">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="capitalize">{key}</span>
                    <button
                      type="button"
                      onClick={() => handleNotificationChange(key)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2 ${value ? "bg-[#4CAF50]" : "bg-gray-300"}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              className="px-6 py-2 bg-[#4A90E2] text-white rounded-md hover:bg-[#357ABD] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4A90E2] focus:ring-offset-2"
              onClick={(e) => {
                if (isEditingPassword && !validatePassword()) {
                  e.preventDefault();
                  return;
                }
              }}
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;