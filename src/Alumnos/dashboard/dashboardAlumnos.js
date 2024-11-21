import React, { useState, useEffect } from "react";
import { FiBook, FiUser, FiClock, FiLogOut, FiBell } from "react-icons/fi";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Configuración de Firebase
import ModuleList from "../modules/ModuleList"; // Componente de módulos
import HistorialProgreso from "../history/Historial"; // Componente de historial
import UserProfile from "../profile/profile"; // Componente de perfil
import ModuloId from "../modules/id/ModuloId"; // Componente ModuloId
import NotificacionesComponent from "../notifications/notificaciones"; // Componente de notificaciones

const Dashboard = ({ userId }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeView, setActiveView] = useState("dashboard");
  const [modules, setModules] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [selectedModule, setSelectedModule] = useState(null);

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
        const totalProgress = cursosData.reduce(
          (acc, curso) => acc + (curso.progreso || 0),
          0
        );
        const averageProgress =
          cursosData.length > 0 ? totalProgress / cursosData.length : 0;
        setOverallProgress(averageProgress);

        // Obtener notificaciones desde Firebase
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

  const handleRefresh = () => {
    window.location.reload();
  };

  // Renderización condicional según la vista activa
  const renderView = () => {
    switch (activeView) {
      case "moduloId":
        return (
          <div className="min-h-screen bg-white">
            <ModuloId module={selectedModule} />
            <button
              onClick={() => setActiveView("dashboard")}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] mt-4"
            >
              Volver al Dashboard
            </button>
          </div>
        );
      case "notificaciones":
        return (
          <div className="min-h-screen bg-white">
            <NotificacionesComponent />
            <button
              onClick={() => setActiveView("dashboard")}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#357ABD] mt-4"
            >
              Volver al Dashboard
            </button>
          </div>
        );
      case "modulo":
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
      case "historial":
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
      case "perfil":
        return (
          <div className="min-h-screen bg-white">
            <UserProfile userId={userId} />
            <button
              onClick={() => setActiveView("dashboard")}
              className="bg-[#4A90E2] text-white px-4 py-2 rounded-md hover:bg-[#4A90E2]/90 mt-4"
            >
              Volver al Dashboard
            </button>
          </div>
        );
      default:
        return (
          <div className="min-h-screen bg-white">
            {/* Progreso general, módulos y notificaciones */}
            {/* Este contenido incluye tus componentes principales */}
          </div>
        );
    }
  };

  return renderView();
};

export default Dashboard;
