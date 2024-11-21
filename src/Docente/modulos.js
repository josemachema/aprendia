import React, { useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUsers } from "react-icons/fi";

const LearningModuleManager = () => {
  const [modules, setModules] = useState([
    {
      id: 1,
      name: "Introducción a React",
      description: "Fundamentos básicos de React y sus principales características",
      assignedTo: ["Grupo A", "Grupo B"],
      status: "active"
    },
    {
      id: 2,
      name: "JavaScript Avanzado",
      description: "Conceptos avanzados de JavaScript y patrones de diseño",
      assignedTo: ["Grupo C"],
      status: "active"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentModule, setCurrentModule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "El nombre del módulo es requerido";
    }
    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      if (currentModule) {
        setModules(modules.map(mod => 
          mod.id === currentModule.id ? { ...mod, ...formData } : mod
        ));
      } else {
        setModules([...modules, { ...formData, id: Date.now(), assignedTo: [], status: "active" }]);
      }
      closeModal();
    }
  };

  const openModal = (module = null) => {
    if (module) {
      setCurrentModule(module);
      setFormData({ name: module.name, description: module.description });
    } else {
      setCurrentModule(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentModule(null);
    setFormData({ name: "", description: "" });
    setErrors({});
  };

  const deleteModule = (id) => {
    setModules(modules.filter(mod => mod.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Módulos de Aprendizaje</h1>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors duration-200"
            aria-label="Crear nuevo módulo"
          >
            <FiPlus className="w-5 h-5" />
            Nuevo Módulo
          </button>
        </div>
      </header>

      {/* Module List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <div key={module.id} className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-102">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{module.name}</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => openModal(module)}
                  className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                  aria-label="Editar módulo"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => deleteModule(module.id)}
                  className="text-red-600 hover:text-red-800 transition-colors duration-200"
                  aria-label="Eliminar módulo"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-4">{module.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FiUsers className="w-4 h-4" />
              <span>{module.assignedTo.join(", ") || "Sin asignaciones"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 animate-modal-show">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {currentModule ? "Editar" : "Crear"} Módulo
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Cerrar modal"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del Módulo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${errors.name ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Ingrese el nombre del módulo"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full p-2 border rounded-lg ${errors.description ? "border-red-500" : "border-gray-300"}`}
                  rows="4"
                  placeholder="Ingrese la descripción del módulo"
                ></textarea>
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <FiCheck className="w-5 h-5" />
                  {currentModule ? "Guardar Cambios" : "Crear Módulo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningModuleManager;