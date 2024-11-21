import React, { useState, useEffect } from "react";
import { FiBook, FiUser, FiClock, FiLogOut, FiBell } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Ajusta la ruta según tu estructura
import ModuleList from "../modules/ModuleList"; // Vista de módulos de aprendizaje
import HistorialProgreso from "../history/Historial"; // Vista del historial

const Dashboard = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [modules, setModules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cursos desde Firebase
        const cursosSnapshot = await getDocs(collection(db, "cursos"));
        const cursosData = cursosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setModules(cursosData);

        // Calcular progreso general
        const totalProgress = cursosData.reduce((acc, curso) => acc + (curso.progreso || 0), 0);
        const averageProgress = cursosData.length > 0 ? totalProgress / cursosData.length : 0;
        setOverallProgress(averageProgress);

        // Obtener fechas importantes y generar notificaciones
        const fechasSnapshot = await getDocs(collection(db, "FechasImportantes"));
        const fechasData = fechasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const generatedNotifications = fechasData.map((fecha) => ({
          id: fecha.id,
          message: `El curso "${fecha.Titulo}" tiene una fecha límite el ${fecha.Fecha}.`,
          type: "info",
        }));
        setNotifications(generatedNotifications);
      } catch (error) {
        console.error("Error al cargar los datos de Firebase:", error);
      }
    };

    fetchData();
  }, []);

  // Vista de módulos de aprendizaje
  if (activeView === "modulo") {
    return (
      <div className="min-h-screen bg-white">
        <ModuleList />
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  // Vista del historial
  if (activeView === "historial") {
    return (
      <div className="min-h-screen bg-white">
        <HistorialProgreso />
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (activeView === "perfil") {
    return (
      <div className="min-h-screen bg-white p-8">
        <h1 className="text-2xl font-bold mb-4">Vista de Perfil</h1>
        {/* Aquí puedes renderizar el componente de perfil */}
        <button
          onClick={() => setActiveView("dashboard")}
          className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
        >
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#4A90E2] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Platform Logo" className="h-10 w-10 rounded-full border-2 border-black" />
            <h1 className="text-2xl font-bold">EduPlatform</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setActiveView("modulo")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiBook /> <span>Módulos de aprendizaje</span>
            </button>
            <button
              onClick={() => setActiveView("perfil")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiUser /> <span>Perfil</span>
            </button>
            <button
              onClick={() => setActiveView("historial")}
              className="flex items-center space-x-2 hover:text-gray-200"
            >
              <FiClock /> <span>Histórico</span>
            </button>
          </nav>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2"
            >
              <img src="images.unsplash.com/photo-1535713875002-d1d0cf377fde" alt="Profile" className="h-8 w-8 rounded-full" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 w-full">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* General Progress */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Progreso General</h2>
            <div className="w-32 h-32 mx-auto">
              <CircularProgressbar value={overallProgress} text={`${Math.round(overallProgress)}%`} />
            </div>
          </div>

          {/* Learning Dimensions */}
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Dimensiones de Aprendizaje</h2>
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{module.nombreCurso}</span>
                    <span className="text-sm font-medium">{module.progreso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-blue-500"
                      style={{ width: `${module.progreso}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Notificaciones</h2>
              <FiBell className="text-xl text-[#9E9E9E]" />
            </div>
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg ${
                    notification.type === "warning" ? "bg-[#FFC107]/20" : "bg-[#00BCD4]/20"
                  }`}
                >
                  <p className="text-sm">{notification.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Modules */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Módulos Activos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-[#F5F5F5] p-6 rounded-lg shadow-md">
                <h3 className="font-bold mb-4">{module.nombreCurso}</h3>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Progreso</span>
                    <span className="text-sm font-medium">{module.progreso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#4CAF50] h-2.5 rounded-full"
                      style={{ width: `${module.progreso}%` }}
                    ></div>
                  </div>
                </div>
                <button className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] w-full">
                  Continuar
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
