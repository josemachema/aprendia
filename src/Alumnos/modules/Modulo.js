import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { BiCheck, BiTime, BiLock } from "react-icons/bi";

const ModuleList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const modules = [
    {
      id: 1,
      title: "Introducción a la Programación",
      description: "Aprende los fundamentos de la programación y lógica computacional",
      status: "completado",
      category: "programming"
    },
    {
      id: 2,
      title: "Desarrollo Web Frontend",
      description: "Domina las tecnologías fundamentales del desarrollo web moderno",
      status: "en_progreso",
      category: "web"
    },
    {
      id: 3,
      title: "Base de Datos SQL",
      description: "Explora los conceptos fundamentales de bases de datos relacionales",
      status: "no_iniciado",
      category: "database"
    }
  ];

  const categories = [
    { id: "all", name: "Todas las Categorías" },
    { id: "programming", name: "Programación" },
    { id: "web", name: "Desarrollo Web" },
    { id: "database", name: "Bases de Datos" }
  ];

  const statusOptions = [
    { id: "all", name: "Todos los Estados" },
    { id: "completado", name: "Completado" },
    { id: "en_progreso", name: "En Progreso" },
    { id: "no_iniciado", name: "No Iniciado" }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completado":
        return <BiCheck className="text-green-500" size={24} />;
      case "en_progreso":
        return <BiTime className="text-yellow-500" size={24} />;
      case "no_iniciado":
        return <BiLock className="text-gray-500" size={24} />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completado":
        return "bg-green-100 text-green-800";
      case "en_progreso":
        return "bg-yellow-100 text-yellow-800";
      case "no_iniciado":
        return "bg-gray-100 text-gray-800";
      default:
        return "";
    }
  };

  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || module.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || module.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#4A90E2] mb-8">Módulos de Aprendizaje</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar módulos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>

          <select
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map(module => (
            <div key={module.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{module.title}</h3>
                  {getStatusIcon(module.status)}
                </div>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(module.status)}`}>
                    {module.status.replace("_", " ").charAt(0).toUpperCase() + module.status.slice(1).replace("_", " ")}
                  </span>
                  <button className="px-4 py-2 bg-[#4A90E2] text-white rounded-lg hover:bg-blue-600 transition-colors duration-300">
                    Ver Módulo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModuleList;